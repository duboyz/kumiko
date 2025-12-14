using BackendApi.Data;
using BackendApi.Extensions;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace BackendApi.Features.Restaurant.StripeConnect.CreateOnboardingLink;

public class CreateOnboardingLinkHandler(
    ApplicationDbContext context,
    IHttpContextAccessor httpContextAccessor,
    IConfiguration configuration,
    ILogger<CreateOnboardingLinkHandler> logger) : ICommandHandler<CreateOnboardingLinkCommand, CreateOnboardingLinkResult>
{
    public async Task<CreateOnboardingLinkResult> Handle(CreateOnboardingLinkCommand request, CancellationToken cancellationToken)
    {
        var userId = httpContextAccessor.GetCurrentUserId();

        // Verify restaurant exists and user has access
        var restaurant = await context.Restaurants
            .Include(r => r.Staff)
                .ThenInclude(ur => ur.User)
            .FirstOrDefaultAsync(r => r.Id == request.RestaurantId, cancellationToken);

        if (restaurant == null)
        {
            throw new KeyNotFoundException("Restaurant not found");
        }

        // Check if user is associated with this restaurant
        var userRestaurant = restaurant.Staff.FirstOrDefault(ur => ur.UserId == userId);
        if (userRestaurant == null)
        {
            throw new UnauthorizedAccessException("You do not have access to this restaurant");
        }

        // Set Stripe API key
        var stripeKey = configuration["Stripe:Connect:SecretKey"] ?? configuration["Stripe:SecretKey"];
        if (string.IsNullOrEmpty(stripeKey))
        {
            logger.LogError("Stripe SecretKey is not configured");
            throw new InvalidOperationException("Stripe SecretKey is not configured");
        }
        StripeConfiguration.ApiKey = stripeKey;

        var returnUrl = configuration["Stripe:Connect:ReturnUrl"] ?? "http://localhost:3004/settings?tab=restaurant";
        var refreshUrl = configuration["Stripe:Connect:RefreshUrl"] ?? "http://localhost:3004/settings?tab=restaurant";
        
        logger.LogInformation("Creating onboarding link for restaurant {RestaurantId}, ReturnUrl: {ReturnUrl}", restaurant.Id, returnUrl);

        string accountId;

        // Create or retrieve Stripe Connect account
        if (string.IsNullOrEmpty(restaurant.StripeConnectAccountId))
        {
            // Create new Connect account
            var accountService = new Stripe.AccountService();
            var userEmail = userRestaurant.User?.Email;
            if (string.IsNullOrEmpty(userEmail))
            {
                logger.LogWarning("User email is null for user {UserId}, using restaurant owner email", userId);
                // Try to get email from the authenticated user
                var user = await context.Users.FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);
                userEmail = user?.Email;
            }
            
            // Convert country name to ISO 3166-1 alpha-2 code (Stripe requirement)
            var countryCode = GetCountryCode(restaurant.Country);
            
            var accountOptions = new Stripe.AccountCreateOptions
            {
                Type = "standard",
                Country = countryCode,
                Email = userEmail,
                Metadata = new Dictionary<string, string>
                {
                    { "restaurant_id", restaurant.Id.ToString() },
                    { "user_id", userId.ToString() }
                }
            };

            logger.LogInformation("Creating Stripe Connect account for restaurant {RestaurantId} with email {Email}", restaurant.Id, userEmail);
            var account = await accountService.CreateAsync(accountOptions, cancellationToken: cancellationToken);
            accountId = account.Id;

            // Save account ID to restaurant
            restaurant.StripeConnectAccountId = accountId;
            restaurant.UpdatedAt = DateTime.UtcNow;
            await context.SaveChangesAsync(cancellationToken);

            logger.LogInformation("Created new Stripe Connect account {AccountId} for restaurant {RestaurantId}", accountId, restaurant.Id);
        }
        else
        {
            accountId = restaurant.StripeConnectAccountId;
            logger.LogInformation("Using existing Stripe Connect account {AccountId} for restaurant {RestaurantId}", accountId, restaurant.Id);
        }

        // Create account link for onboarding
        var accountLinkService = new Stripe.AccountLinkService();
        var accountLinkOptions = new Stripe.AccountLinkCreateOptions
        {
            Account = accountId,
            ReturnUrl = returnUrl,
            RefreshUrl = refreshUrl,
            Type = "account_onboarding"
        };

        var accountLink = await accountLinkService.CreateAsync(accountLinkOptions, cancellationToken: cancellationToken);

        return new CreateOnboardingLinkResult(accountLink.Url);
    }

    private static string GetCountryCode(string? countryName)
    {
        if (string.IsNullOrWhiteSpace(countryName))
            return "US"; // Default to US

        // If already a 2-character code, return as-is (case-insensitive)
        if (countryName.Length == 2)
            return countryName.ToUpperInvariant();

        // Map common country names to ISO codes
        var countryMap = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            { "Norway", "NO" },
            { "United States", "US" },
            { "United States of America", "US" },
            { "USA", "US" },
            { "United Kingdom", "GB" },
            { "UK", "GB" },
            { "Canada", "CA" },
            { "Sweden", "SE" },
            { "Denmark", "DK" },
            { "Finland", "FI" },
            { "Germany", "DE" },
            { "France", "FR" },
            { "Spain", "ES" },
            { "Italy", "IT" },
            { "Netherlands", "NL" },
            { "Belgium", "BE" },
            { "Austria", "AT" },
            { "Switzerland", "CH" },
            { "Poland", "PL" },
            { "Portugal", "PT" },
            { "Ireland", "IE" },
            { "Australia", "AU" },
            { "New Zealand", "NZ" },
            { "Japan", "JP" },
            { "South Korea", "KR" },
            { "China", "CN" },
            { "India", "IN" },
            { "Brazil", "BR" },
            { "Mexico", "MX" },
        };

        if (countryMap.TryGetValue(countryName, out var code))
            return code;

        // If not found, log warning and default to US
        // In production, you might want to throw an exception or use a more comprehensive mapping
        return "US";
    }
}

