using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Subscription.GetUserSubscription;

public record GetUserSubscriptionQuery() : IQuery<GetUserSubscriptionResult>;

public record GetUserSubscriptionResult(
    UserSubscriptionDto? Subscription
);

public record UserSubscriptionDto(
    Guid Id,
    UserSubscriptionPlanDto Plan,
    string Status,
    string BillingInterval,
    DateTime? TrialStartDate,
    DateTime? TrialEndDate,
    DateTime? SubscriptionStartDate,
    DateTime? SubscriptionEndDate,
    DateTime? CurrentPeriodStart,
    DateTime? CurrentPeriodEnd,
    bool IsTrialing,
    bool IsActive,
    bool HasPaymentMethod
);

public record UserSubscriptionPlanDto(
    Guid Id,
    string Name,
    string Tier,
    decimal MonthlyPrice,
    decimal YearlyPrice,
    int MaxLocations,
    int MaxMenusPerLocation
);
