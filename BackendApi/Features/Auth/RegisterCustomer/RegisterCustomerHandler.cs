using BackendApi.Entities;
using BackendApi.Models.Auth;
using BackendApi.Repositories.UserRepository;
using BackendApi.Services.Jwt;
using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Auth.RegisterCustomer;

public class RegisterCustomerHandler(
    IUserRepository userRepository,
    IJwtService jwtService,
    IConfiguration configuration,
    IHttpContextAccessor httpContextAccessor) : ICommandHandler<RegisterCustomerCommand, RegisterCustomerResult>
{
    public async Task<RegisterCustomerResult> Handle(RegisterCustomerCommand request, CancellationToken cancellationToken)
    {
        // Check if user already exists
        var existingUser = await userRepository.GetByEmailAsync(request.Email);
        if (existingUser != null)
        {
            throw new InvalidOperationException("User with this email already exists");
        }

        // Create new customer user (no subscription needed for customers)
        var user = new Entities.User
        {
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            FirstName = request.FirstName,
            LastName = request.LastName,
            PhoneNumber = request.PhoneNumber
        };

        // Save user to database
        await userRepository.AddAsync(user);

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
                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Domain = GetCookieDomain(httpContext),
                    Expires = expiresAt
                };

                httpContext.Response.Cookies.Append("AccessToken", accessToken, cookieOptions);

                var refreshCookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Domain = GetCookieDomain(httpContext),
                    Expires = DateTime.UtcNow.AddDays(7)
                };

                httpContext.Response.Cookies.Append("RefreshToken", refreshToken, refreshCookieOptions);
            }

            // For web clients, we don't return tokens in the response body
            return new RegisterCustomerResult(null, null, expiresAt);
        }
        else if (request.ClientType == ClientType.Mobile)
        {
            // Return tokens in response body for mobile clients
            return new RegisterCustomerResult(accessToken, refreshToken, expiresAt);
        }

        throw new ArgumentException("Invalid client type");
    }

    private static string? GetCookieDomain(HttpContext httpContext)
    {
        var host = httpContext.Request.Host.Host;

        // For localhost, don't set domain
        if (host == "localhost" || host == "127.0.0.1")
            return null;

        // For production, set domain to .kumiko.no for cross-subdomain sharing
        if (host.EndsWith(".kumiko.no") || host == "kumiko.no")
            return ".kumiko.no";

        // For other domains, don't set domain
        return null;
    }
}

