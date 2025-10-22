using BackendApi.Models.Auth;
using BackendApi.Repositories.UserRepository;
using BackendApi.Services.Jwt;
using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Auth.RefreshToken;

public class RefreshTokenHandler(
    IUserRepository userRepository,
    IJwtService jwtService,
    IConfiguration configuration,
    IHttpContextAccessor httpContextAccessor) : ICommandHandler<RefreshTokenCommand, RefreshTokenResult>
{
    public async Task<RefreshTokenResult> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        // Find user by refresh token
        var user = await userRepository.GetByRefreshTokenAsync(request.RefreshToken);

        if (user == null)
        {
            throw new UnauthorizedAccessException("Invalid refresh token");
        }

        // Check if refresh token has expired
        if (user.RefreshTokenExpiresAt == null || user.RefreshTokenExpiresAt < DateTime.UtcNow)
        {
            throw new UnauthorizedAccessException("Refresh token has expired");
        }

        if (!user.IsDeleted)
        {
            throw new UnauthorizedAccessException("Account is deleted");
        }

        // Generate new tokens
        var newAccessToken = jwtService.GenerateAccessToken(user);
        var newRefreshToken = jwtService.GenerateRefreshToken();
        var expiresAt = DateTime.UtcNow.AddMinutes(int.Parse(configuration["Jwt:AccessTokenExpirationMinutes"] ?? "15"));

        // Update refresh token in database
        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiresAt = DateTime.UtcNow.AddDays(int.Parse(configuration["Jwt:RefreshTokenExpirationDays"] ?? "7"));
        await userRepository.UpdateAsync(user);

        // Handle response based on client type
        if (request.ClientType == ClientType.Web)
        {
            // Set httpOnly cookies for web clients
            var httpContext = httpContextAccessor.HttpContext;
            if (httpContext != null)
            {
                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Lax,
                    Expires = expiresAt,
                    Path = "/", // Explicitly set path
                    Domain = "kumiko.no" // Set domain to frontend domain
                };

                httpContext.Response.Cookies.Append("AccessToken", newAccessToken, cookieOptions);

                var refreshCookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Lax,
                    Expires = DateTime.UtcNow.AddDays(7),
                    Path = "/", // Explicitly set path
                    Domain = "kumiko.no" // Set domain to frontend domain
                };

                httpContext.Response.Cookies.Append("RefreshToken", newRefreshToken, refreshCookieOptions);
            }

            // For web clients, we don't return tokens in the response body
            return new RefreshTokenResult(null, null, expiresAt);
        }
        else if (request.ClientType == ClientType.Mobile)
        {
            // Return tokens in response body for mobile clients
            return new RefreshTokenResult(newAccessToken, newRefreshToken, expiresAt);
        }

        throw new ArgumentException("Invalid client type");
    }
}