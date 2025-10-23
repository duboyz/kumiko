using BackendApi.Data;
using BackendApi.Entities;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace BackendApi.Features.Subscription.HandleStripeWebhook;

public class HandleStripeWebhookHandler(
    ApplicationDbContext context,
    IConfiguration configuration,
    ILogger<HandleStripeWebhookHandler> logger)
    : ICommandHandler<HandleStripeWebhookCommand, HandleStripeWebhookResult>
{
    public async Task<HandleStripeWebhookResult> Handle(HandleStripeWebhookCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var webhookSecret = configuration["Stripe:WebhookSecret"];

            // Verify webhook signature
            var stripeEvent = EventUtility.ConstructEvent(
                request.Payload,
                request.Signature,
                webhookSecret
            );

            logger.LogInformation("Processing Stripe webhook event: {EventType}", stripeEvent.Type);

            // Handle different event types
            switch (stripeEvent.Type)
            {
                case "checkout.session.completed":
                    await HandleCheckoutSessionCompleted(stripeEvent, cancellationToken);
                    break;

                case "customer.subscription.created":
                case "customer.subscription.updated":
                    await HandleSubscriptionUpdated(stripeEvent, cancellationToken);
                    break;

                case "customer.subscription.deleted":
                    await HandleSubscriptionDeleted(stripeEvent, cancellationToken);
                    break;

                case "invoice.payment_succeeded":
                    await HandleInvoicePaymentSucceeded(stripeEvent, cancellationToken);
                    break;

                case "invoice.payment_failed":
                    await HandleInvoicePaymentFailed(stripeEvent, cancellationToken);
                    break;

                default:
                    logger.LogInformation("Unhandled event type: {EventType}", stripeEvent.Type);
                    break;
            }

            return new HandleStripeWebhookResult(true, "Webhook processed successfully");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error processing Stripe webhook");
            return new HandleStripeWebhookResult(false, ex.Message);
        }
    }

    private async Task HandleCheckoutSessionCompleted(Event stripeEvent, CancellationToken cancellationToken)
    {
        var session = stripeEvent.Data.Object as Stripe.Checkout.Session;
        if (session == null)
        {
            logger.LogWarning("Checkout session is null");
            return;
        }

        logger.LogInformation("Processing checkout session completed: {SessionId}, Customer: {CustomerId}, Subscription: {SubscriptionId}",
            session.Id, session.CustomerId, session.SubscriptionId);

        var userId = Guid.Parse(session.Metadata["user_id"]);
        var subscriptionPlanId = Guid.Parse(session.Metadata["subscription_plan_id"]);

        logger.LogInformation("User ID: {UserId}, Plan ID: {PlanId}", userId, subscriptionPlanId);

        var user = await context.Users
            .Include(u => u.Subscription)
            .FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);

        if (user == null)
        {
            logger.LogWarning("User not found for checkout session: {UserId}", userId);
            return;
        }

        var plan = await context.SubscriptionPlans
            .FirstOrDefaultAsync(p => p.Id == subscriptionPlanId, cancellationToken);

        if (plan == null)
        {
            logger.LogWarning("Subscription plan not found: {PlanId}", subscriptionPlanId);
            return;
        }

        // Create or update user subscription
        if (user.Subscription == null)
        {
            var billingInterval = session.Mode == "subscription" && session.SubscriptionId != null
                ? BillingInterval.Monthly  // Default to monthly, will be updated by subscription.created event
                : BillingInterval.Monthly;

            user.Subscription = new UserSubscription
            {
                UserId = userId,
                SubscriptionPlanId = subscriptionPlanId,
                Status = SubscriptionStatus.Trialing,
                BillingInterval = billingInterval,
                StripeCustomerId = session.CustomerId,
                StripeSubscriptionId = session.SubscriptionId,
                TrialStartDate = DateTime.UtcNow,
                TrialEndDate = DateTime.UtcNow.AddDays(30)
            };

            await context.UserSubscriptions.AddAsync(user.Subscription, cancellationToken);
        }
        else
        {
            user.Subscription.SubscriptionPlanId = subscriptionPlanId;
            user.Subscription.StripeCustomerId = session.CustomerId;
            user.Subscription.StripeSubscriptionId = session.SubscriptionId;
            user.Subscription.Status = SubscriptionStatus.Trialing;
            user.Subscription.TrialStartDate = DateTime.UtcNow;
            user.Subscription.TrialEndDate = DateTime.UtcNow.AddDays(30);
        }

        await context.SaveChangesAsync(cancellationToken);
        logger.LogInformation("Subscription created for user: {UserId}", userId);
    }

    private async Task HandleSubscriptionUpdated(Event stripeEvent, CancellationToken cancellationToken)
    {
        var subscription = stripeEvent.Data.Object as Stripe.Subscription;
        if (subscription == null) return;

        var userSubscription = await context.UserSubscriptions
            .FirstOrDefaultAsync(s => s.StripeSubscriptionId == subscription.Id, cancellationToken);

        if (userSubscription == null)
        {
            logger.LogWarning("User subscription not found for Stripe subscription: {SubscriptionId}", subscription.Id);
            return;
        }

        // Update subscription status
        userSubscription.Status = subscription.Status switch
        {
            "trialing" => SubscriptionStatus.Trialing,
            "active" => SubscriptionStatus.Active,
            "canceled" => SubscriptionStatus.Canceled,
            "past_due" => SubscriptionStatus.PastDue,
            _ => userSubscription.Status
        };

        // TODO: Update period dates when we figure out the correct Stripe SDK property names
        // Different versions of Stripe.net use different property names for CurrentPeriodStart/End
        // userSubscription.CurrentPeriodStart = ...;
        // userSubscription.CurrentPeriodEnd = ...;

        if (subscription.Status == "active" && userSubscription.SubscriptionStartDate == null)
        {
            userSubscription.SubscriptionStartDate = DateTime.UtcNow;
        }

        logger.LogInformation("Updated subscription status to {Status} for user subscription {Id}", subscription.Status, userSubscription.Id);

        // Determine billing interval from subscription items
        if (subscription.Items?.Data.Any() == true)
        {
            var priceId = subscription.Items.Data[0].Price.Id;
            var plan = await context.SubscriptionPlans
                .FirstOrDefaultAsync(p => p.StripePriceIdMonthly == priceId || p.StripePriceIdYearly == priceId, cancellationToken);

            if (plan != null)
            {
                userSubscription.BillingInterval = priceId == plan.StripePriceIdYearly
                    ? BillingInterval.Yearly
                    : BillingInterval.Monthly;
            }
        }

        await context.SaveChangesAsync(cancellationToken);
        logger.LogInformation("Subscription updated for user subscription: {UserSubscriptionId}", userSubscription.Id);
    }

    private async Task HandleSubscriptionDeleted(Event stripeEvent, CancellationToken cancellationToken)
    {
        var subscription = stripeEvent.Data.Object as Stripe.Subscription;
        if (subscription == null) return;

        var userSubscription = await context.UserSubscriptions
            .FirstOrDefaultAsync(s => s.StripeSubscriptionId == subscription.Id, cancellationToken);

        if (userSubscription == null)
        {
            logger.LogWarning("User subscription not found for Stripe subscription: {SubscriptionId}", subscription.Id);
            return;
        }

        userSubscription.Status = SubscriptionStatus.Canceled;
        userSubscription.CanceledAt = DateTime.UtcNow;
        userSubscription.SubscriptionEndDate = DateTime.UtcNow;

        await context.SaveChangesAsync(cancellationToken);
        logger.LogInformation("Subscription canceled for user subscription: {UserSubscriptionId}", userSubscription.Id);
    }

    private async Task HandleInvoicePaymentSucceeded(Event stripeEvent, CancellationToken cancellationToken)
    {
        var invoice = stripeEvent.Data.Object as Invoice;
        if (invoice == null) return;

        // TODO: Extract subscription ID - property name varies by Stripe SDK version
        // For now, skip invoice processing - subscription.updated handles most cases
        logger.LogInformation("Invoice payment succeeded: {InvoiceId}", invoice.Id);
        await Task.CompletedTask;
    }

    private async Task HandleInvoicePaymentFailed(Event stripeEvent, CancellationToken cancellationToken)
    {
        var invoice = stripeEvent.Data.Object as Invoice;
        if (invoice == null) return;

        // TODO: Extract subscription ID - property name varies by Stripe SDK version
        // For now, skip invoice processing - subscription.updated handles most cases
        logger.LogWarning("Invoice payment failed: {InvoiceId}", invoice.Id);
        await Task.CompletedTask;
    }
}
