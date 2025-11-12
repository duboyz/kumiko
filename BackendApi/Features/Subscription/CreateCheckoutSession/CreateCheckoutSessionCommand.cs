using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Subscription.CreateCheckoutSession;

public record CreateCheckoutSessionCommand(
    Guid SubscriptionPlanId,
    string BillingInterval, // "Monthly" or "Yearly"
    bool SkipTrial = false // Optional: allow users to skip trial and pay immediately
) : ICommand<CreateCheckoutSessionResult>;

public record CreateCheckoutSessionResult(
    string SessionId,
    string SessionUrl
);
