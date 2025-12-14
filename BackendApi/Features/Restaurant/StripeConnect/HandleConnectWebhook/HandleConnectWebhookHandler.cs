using BackendApi.Data;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace BackendApi.Features.Restaurant.StripeConnect.HandleConnectWebhook;

public class HandleConnectWebhookHandler(
    ApplicationDbContext context,
    IConfiguration configuration,
    ILogger<HandleConnectWebhookHandler> logger)
    : ICommandHandler<HandleConnectWebhookCommand, HandleConnectWebhookResult>
{
    public async Task<HandleConnectWebhookResult> Handle(HandleConnectWebhookCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var webhookSecret = configuration["Stripe:WebhookSecret"];

            logger.LogInformation("Received Connect webhook with signature: {SignaturePrefix}...",
                request.Signature?.Length > 20 ? request.Signature.Substring(0, 20) : request.Signature);

            // Verify webhook signature
            var stripeEvent = EventUtility.ConstructEvent(
                request.Payload,
                request.Signature,
                webhookSecret,
                throwOnApiVersionMismatch: false
            );

            logger.LogInformation("Processing Stripe Connect webhook event: {EventType}, EventId: {EventId}",
                stripeEvent.Type, stripeEvent.Id);

            // Handle different event types
            switch (stripeEvent.Type)
            {
                case "account.updated":
                    await HandleAccountUpdated(stripeEvent, cancellationToken);
                    break;

                case "payment_intent.succeeded":
                    await HandlePaymentIntentSucceeded(stripeEvent, cancellationToken);
                    break;

                default:
                    logger.LogInformation("Unhandled Connect event type: {EventType}", stripeEvent.Type);
                    break;
            }

            return new HandleConnectWebhookResult(true, "Webhook processed successfully");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error processing Stripe Connect webhook");
            return new HandleConnectWebhookResult(false, ex.Message);
        }
    }

    private async Task HandleAccountUpdated(Event stripeEvent, CancellationToken cancellationToken)
    {
        var account = stripeEvent.Data.Object as Stripe.Account;
        if (account == null)
        {
            logger.LogWarning("Account is null in account.updated event");
            return;
        }

        logger.LogInformation("Processing account.updated for account: {AccountId}, ChargesEnabled: {ChargesEnabled}, DetailsSubmitted: {DetailsSubmitted}",
            account.Id, account.ChargesEnabled, account.DetailsSubmitted);

        // Find restaurant by Stripe Connect account ID
        var restaurant = await context.Restaurants
            .FirstOrDefaultAsync(r => r.StripeConnectAccountId == account.Id, cancellationToken);

        if (restaurant == null)
        {
            logger.LogWarning("Restaurant not found for Stripe Connect account: {AccountId}", account.Id);
            return;
        }

        // Update restaurant's Stripe Connect status
        restaurant.StripeConnectOnboardingComplete = account.DetailsSubmitted;
        restaurant.StripeConnectChargesEnabled = account.ChargesEnabled;
        restaurant.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Updated Stripe Connect status for restaurant {RestaurantId}: OnboardingComplete={OnboardingComplete}, ChargesEnabled={ChargesEnabled}",
            restaurant.Id, restaurant.StripeConnectOnboardingComplete, restaurant.StripeConnectChargesEnabled);
    }

    private async Task HandlePaymentIntentSucceeded(Event stripeEvent, CancellationToken cancellationToken)
    {
        var paymentIntent = stripeEvent.Data.Object as PaymentIntent;
        if (paymentIntent == null)
        {
            logger.LogWarning("PaymentIntent is null in payment_intent.succeeded event");
            return;
        }

        // Get the connected account ID from the event's account property
        // For events from connected accounts, stripeEvent.Account contains the connected account ID
        var connectedAccountId = stripeEvent.Account;
        if (string.IsNullOrEmpty(connectedAccountId))
        {
            logger.LogWarning("No connected account ID found in event for PaymentIntent {PaymentIntentId}", paymentIntent.Id);
            return;
        }

        logger.LogInformation("Processing payment_intent.succeeded for PaymentIntent: {PaymentIntentId}, Account: {AccountId}, Amount: {Amount}",
            paymentIntent.Id, connectedAccountId, paymentIntent.Amount);

        // Find restaurant by Stripe Connect account ID
        var restaurant = await context.Restaurants
            .FirstOrDefaultAsync(r => r.StripeConnectAccountId == connectedAccountId, cancellationToken);

        if (restaurant == null)
        {
            logger.LogWarning("Restaurant not found for Stripe Connect account: {AccountId}", connectedAccountId);
            return;
        }

        // Find order by PaymentIntent ID
        var order = await context.Orders
            .FirstOrDefaultAsync(o => o.StripePaymentIntentId == paymentIntent.Id, cancellationToken);

        if (order == null)
        {
            logger.LogWarning("Order not found for PaymentIntent: {PaymentIntentId}", paymentIntent.Id);
            return;
        }

        // Get platform fee amount from metadata or calculate it
        decimal platformFeeAmount = 0;
        if (paymentIntent.Metadata != null && paymentIntent.Metadata.TryGetValue("platform_fee_amount", out var feeStr))
        {
            if (decimal.TryParse(feeStr, out var fee))
            {
                platformFeeAmount = fee;
            }
        }

        // If no fee in metadata, calculate it (default 3%)
        if (platformFeeAmount == 0)
        {
            var feePercentageStr = configuration["Stripe:Connect:PlatformFeePercentage"] ?? "0.03";
            var feePercentage = decimal.Parse(feePercentageStr);
            var totalAmount = paymentIntent.Amount / 100m; // Convert from cents
            platformFeeAmount = totalAmount * feePercentage;
        }

        logger.LogInformation(
            "Payment succeeded for order {OrderId}. Total: {Total}, Platform Fee: {Fee}. Marking as paid.",
            order.Id, paymentIntent.Amount / 100m, platformFeeAmount);

        // Update order payment status (Stripe already routed the fee via application_fee_amount)
        order.PaymentStatus = Entities.PaymentStatus.Paid;
        order.PlatformFeeAmount = platformFeeAmount;
        order.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Updated order {OrderId} payment status to Paid", order.Id);
    }
}

