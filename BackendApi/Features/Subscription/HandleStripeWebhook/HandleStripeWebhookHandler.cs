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

            logger.LogInformation("Received webhook with signature: {SignaturePrefix}...",
                request.Signature?.Length > 20 ? request.Signature.Substring(0, 20) : request.Signature);

            // Verify webhook signature
            // throwOnApiVersionMismatch: false allows handling webhooks from different API versions
            var stripeEvent = EventUtility.ConstructEvent(
                request.Payload,
                request.Signature,
                webhookSecret,
                throwOnApiVersionMismatch: false
            );

            logger.LogInformation("Processing Stripe webhook event: {EventType}, EventId: {EventId}",
                stripeEvent.Type, stripeEvent.Id);

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

        logger.LogInformation("Processing checkout session completed: {SessionId}, Customer: {CustomerId}, Subscription: {SubscriptionId}, PaymentStatus: {PaymentStatus}",
            session.Id, session.CustomerId, session.SubscriptionId, session.PaymentStatus);

        // Try to get metadata - be more flexible
        Guid? userId = null;
        Guid? subscriptionPlanId = null;

        if (session.Metadata != null)
        {
            if (session.Metadata.TryGetValue("user_id", out var userIdStr))
                userId = Guid.Parse(userIdStr);
            if (session.Metadata.TryGetValue("subscription_plan_id", out var planIdStr))
                subscriptionPlanId = Guid.Parse(planIdStr);
        }

        // If we don't have metadata, log but continue if we have customer email
        if (!userId.HasValue || !subscriptionPlanId.HasValue)
        {
            logger.LogWarning("Metadata incomplete. Attempting to find user by email: {Email}", session.CustomerEmail);

            if (!string.IsNullOrEmpty(session.CustomerEmail))
            {
                var userByEmail = await context.Users
                    .FirstOrDefaultAsync(u => u.Email.ToLower() == session.CustomerEmail.ToLower(), cancellationToken);

                if (userByEmail != null)
                {
                    userId = userByEmail.Id;
                    logger.LogInformation("Found user by email: {UserId}", userId);

                    // Try to determine plan from Stripe subscription
                    if (!string.IsNullOrEmpty(session.SubscriptionId))
                    {
                        // Get the subscription from Stripe to find the actual price ID
                        var subscriptionService = new Stripe.SubscriptionService();
                        try
                        {
                            var stripeSubscription = await subscriptionService.GetAsync(session.SubscriptionId, cancellationToken: cancellationToken);
                            if (stripeSubscription?.Items?.Data?.Any() == true)
                            {
                                var priceId = stripeSubscription.Items.Data[0].Price.Id;
                                var matchedPlan = await context.SubscriptionPlans
                                    .FirstOrDefaultAsync(p => p.StripePriceIdMonthly == priceId || p.StripePriceIdYearly == priceId, cancellationToken);

                                if (matchedPlan != null)
                                {
                                    subscriptionPlanId = matchedPlan.Id;
                                    logger.LogInformation("Determined plan from Stripe subscription - {PlanName}: {PlanId}", matchedPlan.Name, subscriptionPlanId);
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            logger.LogError(ex, "Failed to fetch subscription from Stripe: {SubscriptionId}", session.SubscriptionId);
                        }

                        // If we still don't have a plan, default to Basic (trial default)
                        if (!subscriptionPlanId.HasValue)
                        {
                            var basicPlan = await context.SubscriptionPlans
                                .FirstOrDefaultAsync(p => p.Tier == SubscriptionTier.Basic && p.IsActive, cancellationToken);

                            if (basicPlan != null)
                            {
                                subscriptionPlanId = basicPlan.Id;
                                logger.LogInformation("Defaulting to Basic plan: {PlanId}", subscriptionPlanId);
                            }
                        }
                    }
                }
            }

            if (!userId.HasValue || !subscriptionPlanId.HasValue)
            {
                logger.LogWarning("Cannot process checkout session without user or plan information");
                return;
            }
        }

        logger.LogInformation("Processing for User ID: {UserId}, Plan ID: {PlanId}", userId, subscriptionPlanId);

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

        // Simple logic: If payment was made, activate the subscription
        bool isPaidSubscription = session.PaymentStatus == "paid";

        logger.LogInformation("Payment status: {PaymentStatus}, Is paid: {IsPaid}, SubscriptionId: {SubscriptionId}",
            session.PaymentStatus, isPaidSubscription, session.SubscriptionId);

        // Create or update user subscription
        if (user.Subscription == null)
        {
            var billingInterval = session.Mode == "subscription" && session.SubscriptionId != null
                ? BillingInterval.Monthly  // Default to monthly, will be updated by subscription.created event
                : BillingInterval.Monthly;

            user.Subscription = new UserSubscription
            {
                UserId = userId.Value,
                SubscriptionPlanId = subscriptionPlanId.Value,
                Status = isPaidSubscription ? SubscriptionStatus.Active : SubscriptionStatus.Trialing,
                BillingInterval = billingInterval,
                StripeCustomerId = session.CustomerId,
                StripeSubscriptionId = session.SubscriptionId,
                TrialStartDate = isPaidSubscription ? null : DateTime.UtcNow,
                TrialEndDate = isPaidSubscription ? null : DateTime.UtcNow.AddDays(14),
                SubscriptionStartDate = isPaidSubscription ? DateTime.UtcNow : null
            };

            await context.UserSubscriptions.AddAsync(user.Subscription, cancellationToken);
        }
        else
        {
            logger.LogInformation("Updating existing subscription for user {UserId}. Current status: {CurrentStatus}",
                userId, user.Subscription.Status);

            user.Subscription.SubscriptionPlanId = subscriptionPlanId.Value;
            user.Subscription.StripeCustomerId = session.CustomerId;
            user.Subscription.StripeSubscriptionId = session.SubscriptionId;

            // Simple: If payment was made, activate the subscription
            if (isPaidSubscription)
            {
                logger.LogInformation("ACTIVATING PAID SUBSCRIPTION for user {UserId}", userId);

                user.Subscription.Status = SubscriptionStatus.Active;
                user.Subscription.SubscriptionStartDate = DateTime.UtcNow;
                // Clear trial dates since user has now paid
                user.Subscription.TrialStartDate = null;
                user.Subscription.TrialEndDate = null;
            }
            else
            {
                // Only set to trialing if payment wasn't made
                logger.LogInformation("Setting subscription to TRIALING for user {UserId}", userId);
                user.Subscription.Status = SubscriptionStatus.Trialing;
                user.Subscription.TrialStartDate = user.Subscription.TrialStartDate ?? DateTime.UtcNow;
                user.Subscription.TrialEndDate = user.Subscription.TrialEndDate ?? DateTime.UtcNow.AddDays(14);
            }
        }

        await context.SaveChangesAsync(cancellationToken);
        logger.LogInformation("Subscription {Status} for user: {UserId}",
            isPaidSubscription ? "activated" : "trial started", userId);
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

        // TODO: Update period dates when Stripe SDK properties are confirmed
        // The Stripe.Subscription object doesn't directly expose CurrentPeriodStart/End
        // These might be available through subscription.Items or another property
        // For now, we'll track them through webhook events

        if (subscription.Status == "active" && userSubscription.SubscriptionStartDate == null)
        {
            userSubscription.SubscriptionStartDate = DateTime.UtcNow;
        }

        logger.LogInformation("Updated subscription status to {Status} for user subscription {Id}", subscription.Status, userSubscription.Id);

        // Determine billing interval and update plan from subscription items
        if (subscription.Items?.Data.Any() == true)
        {
            var priceId = subscription.Items.Data[0].Price.Id;
            var plan = await context.SubscriptionPlans
                .FirstOrDefaultAsync(p => p.StripePriceIdMonthly == priceId || p.StripePriceIdYearly == priceId, cancellationToken);

            if (plan != null)
            {
                // Update the subscription plan ID based on the price
                userSubscription.SubscriptionPlanId = plan.Id;

                // Update billing interval
                userSubscription.BillingInterval = priceId == plan.StripePriceIdYearly
                    ? BillingInterval.Yearly
                    : BillingInterval.Monthly;

                logger.LogInformation("Updated subscription plan to {PlanName} (ID: {PlanId}) for user subscription {Id}",
                    plan.Name, plan.Id, userSubscription.Id);
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
