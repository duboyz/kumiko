using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Restaurant.StripeConnect.GetConnectStatus;

public record GetConnectStatusQuery(Guid RestaurantId) : IQuery<GetConnectStatusResult>;

