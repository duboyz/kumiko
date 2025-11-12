using BackendApi.Data;
using BackendApi.Entities;
using BackendApi.Models.Auth;
using BackendApi.Repositories.UserRepository;
using BackendApi.Services.Jwt;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.Auth.Register;

public class RegisterHandler(
    IUserRepository userRepository,
    IJwtService jwtService,
    IConfiguration configuration,
    IHttpContextAccessor httpContextAccessor,
    ApplicationDbContext context) : ICommandHandler<RegisterCommand, RegisterResult>
{
    public async Task<RegisterResult> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        // Check if user already exists
        var existingUser = await userRepository.GetByEmailAsync(request.Email);
        if (existingUser != null)
        {
            throw new InvalidOperationException("User with this email already exists");
        }

        // Create new user
        var user = new Entities.User
        {
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            FirstName = request.FirstName,
            LastName = request.LastName
        };

        // Save user to database
        await userRepository.AddAsync(user);

        // Initialize 14-day free trial subscription
        var basicPlan = await context.SubscriptionPlans
            .FirstOrDefaultAsync(p => p.Tier == SubscriptionTier.Basic && p.IsActive, cancellationToken);

        if (basicPlan != null)
        {
            var trialSubscription = new UserSubscription
            {
                UserId = user.Id,
                SubscriptionPlanId = basicPlan.Id,
                Status = SubscriptionStatus.Trialing,
                BillingInterval = BillingInterval.Monthly,
                TrialStartDate = DateTime.UtcNow,
                TrialEndDate = DateTime.UtcNow.AddDays(14),
                StripeCustomerId = null,
                StripeSubscriptionId = null
            };

            context.UserSubscriptions.Add(trialSubscription);
            await context.SaveChangesAsync(cancellationToken);
        }

        // Generate tokens
        var accessToken = jwtService.GenerateAccessToken(user);
        var refreshToken = jwtService.GenerateRefreshToken();
        var expiresAt = DateTime.UtcNow.AddMinutes(int.Parse(configuration["Jwt:AccessTokenExpirationMinutes"] ?? "15"));

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
                    SameSite = SameSiteMode.None, // Allow cross-origin requests
                    Domain = GetCookieDomain(httpContext),
                    Expires = expiresAt
                };

                httpContext.Response.Cookies.Append("AccessToken", accessToken, cookieOptions);

                var refreshCookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true, // Required for SameSite=None
                    SameSite = SameSiteMode.None, // Allow cross-origin requests
                    Domain = GetCookieDomain(httpContext),
                    Expires = DateTime.UtcNow.AddDays(7) // Refresh token lasts longer
                };

                httpContext.Response.Cookies.Append("RefreshToken", refreshToken, refreshCookieOptions);
            }

            // For web clients, we don't return tokens in the response body
            return new RegisterResult(null, null, expiresAt);
        }
        else if (request.ClientType == ClientType.Mobile)
        {
            // Return tokens in response body for mobile clients
            return new RegisterResult(accessToken, refreshToken, expiresAt);
        }

        throw new ArgumentException("Invalid client type");
    }

    private static string? GetCookieDomain(HttpContext httpContext)
    {
        var host = httpContext.Request.Host.Host;

        // For localhost, don't set domain (cookies work on exact host)
        if (host == "localhost" || host == "127.0.0.1")
            return null;

        // For production (api.kumiko.no), set domain to .kumiko.no for cross-subdomain sharing
        if (host.EndsWith(".kumiko.no") || host == "kumiko.no")
            return ".kumiko.no";

        // For Railway preview environments or other domains, don't set domain
        return null;
    }
}