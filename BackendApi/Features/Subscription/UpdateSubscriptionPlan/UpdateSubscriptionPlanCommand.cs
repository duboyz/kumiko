using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Subscription.UpdateSubscriptionPlan;

public record UpdateSubscriptionPlanCommand(
    Guid PlanId,
    string? StripePriceIdMonthly,
    string? StripePriceIdYearly
) : ICommand<UpdateSubscriptionPlanResult>;

public record UpdateSubscriptionPlanResult(
    bool Success,
    string Message
);
