using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Order.CreateCheckoutSession;

public record CreateCheckoutSessionCommand(Guid OrderId) : ICommand<CreateCheckoutSessionResult>;

public record CreateCheckoutSessionResult(string CheckoutUrl);


