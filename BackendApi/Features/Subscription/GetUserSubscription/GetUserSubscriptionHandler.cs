using BackendApi.Data;
using BackendApi.Entities;
using BackendApi.Extensions;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.Subscription.GetUserSubscription;

public class GetUserSubscriptionHandler(
    ApplicationDbContext context,
    IHttpContextAccessor httpContextAccessor)
    : IQueryHandler<GetUserSubscriptionQuery, GetUserSubscriptionResult>
{
    public async Task<GetUserSubscriptionResult> Handle(GetUserSubscriptionQuery request, CancellationToken cancellationToken)
    {
        var userId = httpContextAccessor.GetCurrentUserId();

        var subscription = await context.UserSubscriptions
            .Include(s => s.SubscriptionPlan)
            .FirstOrDefaultAsync(s => s.UserId == userId, cancellationToken);

        if (subscription == null)
        {
            return new GetUserSubscriptionResult(null);
        }

        var dto = new UserSubscriptionDto(
            subscription.Id,
            new SubscriptionPlanDto(
                subscription.SubscriptionPlan.Id,
                subscription.SubscriptionPlan.Name,
                subscription.SubscriptionPlan.Tier.ToString(),
                subscription.SubscriptionPlan.MonthlyPrice,
                subscription.SubscriptionPlan.YearlyPrice,
                subscription.SubscriptionPlan.MaxLocations,
                subscription.SubscriptionPlan.MaxMenusPerLocation
            ),
            subscription.Status.ToString(),
            subscription.BillingInterval.ToString(),
            subscription.TrialStartDate,
            subscription.TrialEndDate,
            subscription.SubscriptionStartDate,
            subscription.SubscriptionEndDate,
            subscription.CurrentPeriodStart,
            subscription.CurrentPeriodEnd,
            subscription.Status == SubscriptionStatus.Trialing,
            subscription.Status == SubscriptionStatus.Active || subscription.Status == SubscriptionStatus.Trialing
        );

        return new GetUserSubscriptionResult(dto);
    }
}
