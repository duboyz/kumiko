using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Subscription.CancelSubscription;

public record CancelSubscriptionCommand() : ICommand<CancelSubscriptionResult>;

public record CancelSubscriptionResult(
    bool Success,
    string Message
);
