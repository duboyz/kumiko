using BackendApi.Data;
using BackendApi.Extensions;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace BackendApi.Features.Subscription.CancelSubscription;

public class CancelSubscriptionHandler(
    ApplicationDbContext context,
    IHttpContextAccessor httpContextAccessor,
    IConfiguration configuration,
    ILogger<CancelSubscriptionHandler> logger)
    : ICommandHandler<CancelSubscriptionCommand, CancelSubscriptionResult>
{
    public async Task<CancelSubscriptionResult> Handle(CancelSubscriptionCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var userId = httpContextAccessor.GetCurrentUserId();

            var userSubscription = await context.UserSubscriptions
                .FirstOrDefaultAsync(s => s.UserId == userId, cancellationToken);

            if (userSubscription == null)
            {
                return new CancelSubscriptionResult(false, "No active subscription found");
            }

            if (userSubscription.StripeSubscriptionId == null)
            {
                return new CancelSubscriptionResult(false, "No Stripe subscription found");
            }

            // Set Stripe API key
            StripeConfiguration.ApiKey = configuration["Stripe:SecretKey"];

            // Cancel the subscription in Stripe (at period end)
            var subscriptionService = new SubscriptionService();
            await subscriptionService.CancelAsync(
                userSubscription.StripeSubscriptionId,
                new SubscriptionCancelOptions
                {
                    InvoiceNow = false,
                    Prorate = false
                },
                cancellationToken: cancellationToken
            );

            logger.LogInformation("Subscription canceled for user: {UserId}", userId);

            return new CancelSubscriptionResult(true, "Subscription canceled successfully. Access will continue until the end of the billing period.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error canceling subscription");
            return new CancelSubscriptionResult(false, "Failed to cancel subscription");
        }
    }
}
