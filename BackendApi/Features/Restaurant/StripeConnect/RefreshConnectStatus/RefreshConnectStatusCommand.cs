using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Restaurant.StripeConnect.RefreshConnectStatus;

public record RefreshConnectStatusCommand(Guid RestaurantId) : ICommand<RefreshConnectStatusResult>;

