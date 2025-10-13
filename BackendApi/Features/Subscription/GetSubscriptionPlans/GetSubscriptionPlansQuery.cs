using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Subscription.GetSubscriptionPlans;

public record GetSubscriptionPlansQuery() : IQuery<GetSubscriptionPlansResult>;

public record GetSubscriptionPlansResult(
    List<SubscriptionPlanDto> Plans
);

public record SubscriptionPlanDto(
    Guid Id,
    string Name,
    string Tier,
    decimal MonthlyPrice,
    decimal YearlyPrice,
    int MaxLocations,
    int MaxMenusPerLocation,
    bool IsActive
);
