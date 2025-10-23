using BackendApi.Models.Auth;
using BackendApi.Repositories.UserRepository;
using BackendApi.Services.Jwt;
using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Auth.Login;

public class LoginHandler(
    IUserRepository userRepository,
    IJwtService jwtService,
    IConfiguration configuration,
    IHttpContextAccessor httpContextAccessor) : ICommandHandler<LoginCommand, LoginResult>
{
    public async Task<LoginResult> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await userRepository.GetByEmailAsync(request.Email);
        if (user == null)
        {
            throw new UnauthorizedAccessException("Invalid email or password");
        }

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Invalid email or password");
        }

        if (user.IsDeleted)
        {
            throw new UnauthorizedAccessException("Account is deleted");
        }

        // Generate tokens
        var accessToken = jwtService.GenerateAccessToken(user);
        var refreshToken = jwtService.GenerateRefreshToken();
        var expiresAt = DateTime.UtcNow.AddMinutes(int.Parse(configuration["Jwt:AccessTokenExpirationMinutes"] ?? "15"));

        // Store refresh token in database
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiresAt = DateTime.UtcNow.AddDays(int.Parse(configuration["Jwt:RefreshTokenExpirationDays"] ?? "7"));
        await userRepository.UpdateAsync(user);

        // Handle response based on client type
        if (request.ClientType == ClientType.Web)
        {
            // Set httpOnly cookies for web clients
            var httpContext = httpContextAccessor.HttpContext;
            if (httpContext != null)
            {
                var isProduction = httpContext.Request.Host.Host.Contains("kumiko.no") || 
                                 httpContext.Request.Host.Host.Contains("vercel.app");
                
                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true, // Required for SameSite=None
                    SameSite = SameSiteMode.None, // Allow cross-origin requests
                    Expires = expiresAt,
                    Path = "/"
                };

                // Set domain for production to allow subdomain access
                if (isProduction)
                {
                    // Only set domain for kumiko.no, not for Vercel
                    if (httpContext.Request.Host.Host.Contains("kumiko.no"))
                    {
                        cookieOptions.Domain = ".kumiko.no";
                    }
                    // For Vercel domains, don't set domain (let browser handle it)
                }

                httpContext.Response.Cookies.Append("AccessToken", accessToken, cookieOptions);

                var refreshCookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true, // Required for SameSite=None
                    SameSite = SameSiteMode.None, // Allow cross-origin requests
                    Expires = DateTime.UtcNow.AddDays(7), // Refresh token lasts longer
                    Path = "/"
                };

                // Set domain for production to allow subdomain access
                if (isProduction)
                {
                    // Only set domain for kumiko.no, not for Vercel
                    if (httpContext.Request.Host.Host.Contains("kumiko.no"))
                    {
                        refreshCookieOptions.Domain = ".kumiko.no";
                    }
                    // For Vercel domains, don't set domain (let browser handle it)
                }

                httpContext.Response.Cookies.Append("RefreshToken", refreshToken, refreshCookieOptions);
            }

            // For web clients, we don't return tokens in the response body
            return new LoginResult(null, null, expiresAt);
        }
        else if (request.ClientType == ClientType.Mobile)
        {
            // Return tokens in response body for mobile clients
            return new LoginResult(accessToken, refreshToken, expiresAt);
        }

        throw new ArgumentException("Invalid client type");
    }
}