using BackendApi.Data;
using BackendApi.Entities;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.Subscription.InitializeTrialForExistingUsers;

public class InitializeTrialForExistingUsersHandler(
    ApplicationDbContext context,
    ILogger<InitializeTrialForExistingUsersHandler> logger)
    : ICommandHandler<InitializeTrialForExistingUsersCommand, InitializeTrialForExistingUsersResult>
{
    public async Task<InitializeTrialForExistingUsersResult> Handle(
        InitializeTrialForExistingUsersCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            // Get all users who don't have a subscription
            var usersWithoutSubscription = await context.Users
                .Where(u => !context.UserSubscriptions.Any(s => s.UserId == u.Id))
                .ToListAsync(cancellationToken);

            if (usersWithoutSubscription.Count == 0)
            {
                return new InitializeTrialForExistingUsersResult(
                    true,
                    "All users already have subscriptions",
                    0
                );
            }

            // Get the Basic plan
            var basicPlan = await context.SubscriptionPlans
                .FirstOrDefaultAsync(p => p.Tier == SubscriptionTier.Basic && p.IsActive, cancellationToken);

            if (basicPlan == null)
            {
                return new InitializeTrialForExistingUsersResult(
                    false,
                    "Basic subscription plan not found",
                    0
                );
            }

            var subscriptionsToAdd = new List<UserSubscription>();

            foreach (var user in usersWithoutSubscription)
            {
                // Calculate trial end date based on when user registered
                var daysSinceRegistration = (DateTime.UtcNow - user.CreatedAt).Days;
                var trialDaysRemaining = Math.Max(0, 14 - daysSinceRegistration);

                var subscription = new UserSubscription
                {
                    UserId = user.Id,
                    SubscriptionPlanId = basicPlan.Id,
                    Status = trialDaysRemaining > 0 ? SubscriptionStatus.Trialing : SubscriptionStatus.Expired,
                    BillingInterval = BillingInterval.Monthly,
                    TrialStartDate = user.CreatedAt,
                    TrialEndDate = user.CreatedAt.AddDays(14),
                    StripeCustomerId = null,
                    StripeSubscriptionId = null,
                    CreatedAt = DateTime.UtcNow
                };

                subscriptionsToAdd.Add(subscription);

                logger.LogInformation(
                    "Adding {Status} subscription for user {Email} (registered {Days} days ago)",
                    subscription.Status,
                    user.Email,
                    daysSinceRegistration
                );
            }

            context.UserSubscriptions.AddRange(subscriptionsToAdd);
            await context.SaveChangesAsync(cancellationToken);

            return new InitializeTrialForExistingUsersResult(
                true,
                $"Successfully added trial subscriptions for {subscriptionsToAdd.Count} users",
                subscriptionsToAdd.Count
            );
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error initializing trial subscriptions for existing users");
            return new InitializeTrialForExistingUsersResult(
                false,
                $"Error: {ex.Message}",
                0
            );
        }
    }
}