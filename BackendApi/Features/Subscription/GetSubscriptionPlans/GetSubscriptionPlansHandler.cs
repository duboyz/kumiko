using BackendApi.Data;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.Subscription.GetSubscriptionPlans;

public class GetSubscriptionPlansHandler(ApplicationDbContext context)
    : IQueryHandler<GetSubscriptionPlansQuery, GetSubscriptionPlansResult>
{
    public async Task<GetSubscriptionPlansResult> Handle(GetSubscriptionPlansQuery request, CancellationToken cancellationToken)
    {
        var plans = await context.SubscriptionPlans
            .Where(p => p.IsActive)
            .OrderBy(p => p.Tier)
            .Select(p => new SubscriptionPlanDto(
                p.Id,
                p.Name,
                p.Tier.ToString(),
                p.MonthlyPrice,
                p.YearlyPrice,
                p.MaxLocations,
                p.MaxMenusPerLocation,
                p.IsActive
            ))
            .ToListAsync(cancellationToken);

        return new GetSubscriptionPlansResult(plans);
    }
}
