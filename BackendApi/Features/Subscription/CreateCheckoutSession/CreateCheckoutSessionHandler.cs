using BackendApi.Data;
using BackendApi.Entities;
using BackendApi.Extensions;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;
using Stripe;
using Stripe.Checkout;

namespace BackendApi.Features.Subscription.CreateCheckoutSession;

public class CreateCheckoutSessionHandler(
    ApplicationDbContext context,
    IHttpContextAccessor httpContextAccessor,
    IConfiguration configuration,
    ILogger<CreateCheckoutSessionHandler> logger)
    : ICommandHandler<CreateCheckoutSessionCommand, CreateCheckoutSessionResult>
{
    public async Task<CreateCheckoutSessionResult> Handle(CreateCheckoutSessionCommand request, CancellationToken cancellationToken)
    {
        var userId = httpContextAccessor.GetCurrentUserId();

        // Get user
        var user = await context.Users
            .Include(u => u.Subscription)
            .FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);

        if (user == null)
            throw new Exception("User not found");

        // Get subscription plan
        var plan = await context.SubscriptionPlans
            .FirstOrDefaultAsync(p => p.Id == request.SubscriptionPlanId && p.IsActive, cancellationToken);

        if (plan == null)
            throw new Exception("Subscription plan not found");

        logger.LogInformation("Found plan: {PlanName} (ID: {PlanId})", plan.Name, plan.Id);
        logger.LogInformation("Plan price IDs - Monthly: {Monthly}, Yearly: {Yearly}",
            plan.StripePriceIdMonthly, plan.StripePriceIdYearly);

        // Set Stripe API key
        var stripeKey = configuration["Stripe:SecretKey"];
        StripeConfiguration.ApiKey = stripeKey;
        logger.LogInformation("Using Stripe API key: {KeyPrefix}...", stripeKey?.Substring(0, 20));

        // Get or create Stripe customer
        string customerId;
        if (user.Subscription?.StripeCustomerId != null)
        {
            customerId = user.Subscription.StripeCustomerId;
        }
        else
        {
            var customerService = new CustomerService();
            var customer = await customerService.CreateAsync(new CustomerCreateOptions
            {
                Email = user.Email,
                Name = $"{user.FirstName} {user.LastName}".Trim(),
                Metadata = new Dictionary<string, string>
                {
                    { "user_id", userId.ToString() }
                }
            }, cancellationToken: cancellationToken);
            customerId = customer.Id;
        }

        // Determine which price ID to use based on billing interval
        var priceId = request.BillingInterval.ToLower() == "yearly"
            ? plan.StripePriceIdYearly
            : plan.StripePriceIdMonthly;

        logger.LogInformation("Billing interval: {Interval}, Selected price ID: {PriceId}",
            request.BillingInterval, priceId);

        if (string.IsNullOrEmpty(priceId))
        {
            throw new Exception($"Stripe price ID not configured for {plan.Name} plan ({request.BillingInterval}). " +
                $"Please create a product in Stripe Dashboard and update the subscription plan with the price IDs. " +
                $"Run this SQL: UPDATE \"SubscriptionPlans\" SET \"StripePriceIdMonthly\" = 'price_xxx', \"StripePriceIdYearly\" = 'price_yyy' WHERE \"Id\" = '{plan.Id}'");
        }

        logger.LogInformation("Creating Stripe checkout session with price ID: {PriceId}", priceId);

        // Create checkout session with 30-day trial
        var sessionService = new SessionService();
        var options = new SessionCreateOptions
        {
            Customer = customerId,
            PaymentMethodTypes = new List<string> { "card" },
            LineItems = new List<SessionLineItemOptions>
            {
                new SessionLineItemOptions
                {
                    Price = priceId,
                    Quantity = 1,
                }
            },
            Mode = "subscription",
            SubscriptionData = new SessionSubscriptionDataOptions
            {
                TrialPeriodDays = 30,
                Metadata = new Dictionary<string, string>
                {
                    { "user_id", userId.ToString() },
                    { "subscription_plan_id", plan.Id.ToString() }
                }
            },
            SuccessUrl = $"{configuration["Frontend:BaseUrl"]}/subscription/success?session_id={{CHECKOUT_SESSION_ID}}",
            CancelUrl = $"{configuration["Frontend:BaseUrl"]}/subscription/cancel",
            Metadata = new Dictionary<string, string>
            {
                { "user_id", userId.ToString() },
                { "subscription_plan_id", plan.Id.ToString() }
            }
        };

        var session = await sessionService.CreateAsync(options, cancellationToken: cancellationToken);

        return new CreateCheckoutSessionResult(session.Id, session.Url);
    }
}
