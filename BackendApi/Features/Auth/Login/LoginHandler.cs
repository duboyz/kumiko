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
                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true, // Required for SameSite=None
                    SameSite = SameSiteMode.None, // Required for cross-origin
                    Expires = expiresAt,
                    Path = "/" // Explicitly set path
                    // Don't set Domain - let it default to the request domain
                };

                Console.WriteLine($"🍪 Setting AccessToken cookie: {accessToken.Substring(0, Math.Min(20, accessToken.Length))}...");
                Console.WriteLine($"🍪 Cookie options: HttpOnly={cookieOptions.HttpOnly}, Secure={cookieOptions.Secure}, SameSite={cookieOptions.SameSite}");
                Console.WriteLine($"🍪 Request origin: {httpContext.Request.Headers.Origin}");
                Console.WriteLine($"🍪 Request host: {httpContext.Request.Host}");
                Console.WriteLine($"🍪 Request headers:");
                foreach (var header in httpContext.Request.Headers)
                {
                    Console.WriteLine($"🍪   {header.Key}: {string.Join(", ", header.Value)}");
                }
                
                httpContext.Response.Cookies.Append("AccessToken", accessToken, cookieOptions);
                
                // Verify cookie was set
                var cookieSet = httpContext.Response.Headers.ContainsKey("Set-Cookie");
                Console.WriteLine($"🍪 AccessToken cookie set in response headers: {cookieSet}");

                var refreshCookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true, // Required for SameSite=None
                    SameSite = SameSiteMode.None, // Required for cross-origin
                    Expires = DateTime.UtcNow.AddDays(7), // Refresh token lasts longer
                    Path = "/" // Explicitly set path
                    // Don't set Domain - let it default to the request domain
                };

                Console.WriteLine($"🍪 Setting RefreshToken cookie: {refreshToken.Substring(0, Math.Min(20, refreshToken.Length))}...");
                httpContext.Response.Cookies.Append("RefreshToken", refreshToken, refreshCookieOptions);
                
                // Log all Set-Cookie headers
                var setCookieHeaders = httpContext.Response.Headers.Where(h => h.Key.Equals("Set-Cookie", StringComparison.OrdinalIgnoreCase)).ToList();
                Console.WriteLine($"🍪 Total Set-Cookie headers: {setCookieHeaders.Count}");
                foreach (var header in setCookieHeaders)
                {
                    Console.WriteLine($"🍪 Set-Cookie: {header.Value}");
                }
                
                // Log all response headers to debug
                Console.WriteLine($"🍪 All response headers:");
                foreach (var header in httpContext.Response.Headers)
                {
                    Console.WriteLine($"🍪 {header.Key}: {string.Join(", ", header.Value)}");
                }
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