using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Restaurant.StripeConnect.GetPublicConnectStatus;

public record GetPublicConnectStatusQuery(Guid RestaurantId) : IQuery<GetPublicConnectStatusResult>;

public record GetPublicConnectStatusResult(
    bool IsConnected,
    bool ChargesEnabled);


