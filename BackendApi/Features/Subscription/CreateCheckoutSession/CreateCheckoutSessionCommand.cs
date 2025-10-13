using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Subscription.CreateCheckoutSession;

public record CreateCheckoutSessionCommand(
    Guid SubscriptionPlanId,
    string BillingInterval // "Monthly" or "Yearly"
) : ICommand<CreateCheckoutSessionResult>;

public record CreateCheckoutSessionResult(
    string SessionId,
    string SessionUrl
);
