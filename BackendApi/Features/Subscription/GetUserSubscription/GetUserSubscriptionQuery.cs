using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Subscription.GetUserSubscription;

public record GetUserSubscriptionQuery() : IQuery<GetUserSubscriptionResult>;

public record GetUserSubscriptionResult(
    UserSubscriptionDto? Subscription
);

public record UserSubscriptionDto(
    Guid Id,
    SubscriptionPlanDto Plan,
    string Status,
    string BillingInterval,
    DateTime? TrialStartDate,
    DateTime? TrialEndDate,
    DateTime? SubscriptionStartDate,
    DateTime? SubscriptionEndDate,
    DateTime? CurrentPeriodStart,
    DateTime? CurrentPeriodEnd,
    bool IsTrialing,
    bool IsActive
);

public record SubscriptionPlanDto(
    Guid Id,
    string Name,
    string Tier,
    decimal MonthlyPrice,
    decimal YearlyPrice,
    int MaxLocations,
    int MaxMenusPerLocation
);
