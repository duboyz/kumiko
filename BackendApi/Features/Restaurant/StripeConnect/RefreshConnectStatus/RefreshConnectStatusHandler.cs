using BackendApi.Data;
using BackendApi.Extensions;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace BackendApi.Features.Restaurant.StripeConnect.RefreshConnectStatus;

public class RefreshConnectStatusHandler(
    ApplicationDbContext context,
    IHttpContextAccessor httpContextAccessor,
    IConfiguration configuration,
    ILogger<RefreshConnectStatusHandler> logger) : ICommandHandler<RefreshConnectStatusCommand, RefreshConnectStatusResult>
{
    public async Task<RefreshConnectStatusResult> Handle(RefreshConnectStatusCommand request, CancellationToken cancellationToken)
    {
        var userId = httpContextAccessor.GetCurrentUserId();

        // Verify restaurant exists and user has access
        var restaurant = await context.Restaurants
            .Include(r => r.Staff)
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

        // Check if account exists
        if (string.IsNullOrEmpty(restaurant.StripeConnectAccountId))
        {
            return new RefreshConnectStatusResult(
                Success: false,
                OnboardingComplete: false,
                ChargesEnabled: false,
                ErrorMessage: "No Stripe Connect account found"
            );
        }

        try
        {
            // Set Stripe API key
            var stripeKey = configuration["Stripe:SecretKey"];
            if (string.IsNullOrEmpty(stripeKey))
            {
                throw new InvalidOperationException("Stripe SecretKey is not configured");
            }
            StripeConfiguration.ApiKey = stripeKey;

            // Fetch account status directly from Stripe
            var accountService = new Stripe.AccountService();
            var account = await accountService.GetAsync(restaurant.StripeConnectAccountId, cancellationToken: cancellationToken);

            // Update restaurant status from Stripe
            restaurant.StripeConnectOnboardingComplete = account.DetailsSubmitted;
            restaurant.StripeConnectChargesEnabled = account.ChargesEnabled;
            restaurant.UpdatedAt = DateTime.UtcNow;

            await context.SaveChangesAsync(cancellationToken);

            logger.LogInformation(
                "Refreshed Stripe Connect status for restaurant {RestaurantId}: OnboardingComplete={OnboardingComplete}, ChargesEnabled={ChargesEnabled}",
                restaurant.Id, restaurant.StripeConnectOnboardingComplete, restaurant.StripeConnectChargesEnabled);

            return new RefreshConnectStatusResult(
                Success: true,
                OnboardingComplete: restaurant.StripeConnectOnboardingComplete,
                ChargesEnabled: restaurant.StripeConnectChargesEnabled,
                ErrorMessage: null
            );
        }
        catch (StripeException ex)
        {
            logger.LogError(ex, "Stripe error refreshing account status for restaurant {RestaurantId}", restaurant.Id);
            return new RefreshConnectStatusResult(
                Success: false,
                OnboardingComplete: restaurant.StripeConnectOnboardingComplete,
                ChargesEnabled: restaurant.StripeConnectChargesEnabled,
                ErrorMessage: ex.Message
            );
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error refreshing account status for restaurant {RestaurantId}", restaurant.Id);
            return new RefreshConnectStatusResult(
                Success: false,
                OnboardingComplete: restaurant.StripeConnectOnboardingComplete,
                ChargesEnabled: restaurant.StripeConnectChargesEnabled,
                ErrorMessage: ex.Message
            );
        }
    }
}

