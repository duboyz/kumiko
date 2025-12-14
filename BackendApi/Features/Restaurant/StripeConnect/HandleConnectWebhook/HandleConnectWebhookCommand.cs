using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Restaurant.StripeConnect.HandleConnectWebhook;

public record HandleConnectWebhookCommand(string Payload, string Signature) : ICommand<HandleConnectWebhookResult>;

