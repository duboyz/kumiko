using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Subscription.HandleStripeWebhook;

public record HandleStripeWebhookCommand(
    string Payload,
    string Signature
) : ICommand<HandleStripeWebhookResult>;

public record HandleStripeWebhookResult(
    bool Success,
    string Message
);
