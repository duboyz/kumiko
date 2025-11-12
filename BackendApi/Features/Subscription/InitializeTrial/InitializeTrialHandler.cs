using BackendApi.Data;
using BackendApi.Entities;
using BackendApi.Extensions;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.Subscription.InitializeTrial;

public class InitializeTrialHandler(
    ApplicationDbContext context,
    IHttpContextAccessor httpContextAccessor)
    : ICommandHandler<InitializeTrialCommand, InitializeTrialResult>
{
    public async Task<InitializeTrialResult> Handle(InitializeTrialCommand request, CancellationToken cancellationToken)
    {
        var userId = httpContextAccessor.GetCurrentUserId();

        // Check if user already has a subscription
        var existingSubscription = await context.UserSubscriptions
            .FirstOrDefaultAsync(s => s.UserId == userId, cancellationToken);

        if (existingSubscription != null)
        {
            return new InitializeTrialResult(false, "You already have an active subscription");
        }

        // Get the Basic plan
        var basicPlan = await context.SubscriptionPlans
            .FirstOrDefaultAsync(p => p.Tier == SubscriptionTier.Basic && p.IsActive, cancellationToken);

        if (basicPlan == null)
        {
            return new InitializeTrialResult(false, "Basic plan not found");
        }

        // Create trial subscription
        var trialSubscription = new UserSubscription
        {
            UserId = userId,
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

        return new InitializeTrialResult(true, $"14-day free trial activated! Trial ends on {trialSubscription.TrialEndDate:yyyy-MM-dd}");
    }
}
