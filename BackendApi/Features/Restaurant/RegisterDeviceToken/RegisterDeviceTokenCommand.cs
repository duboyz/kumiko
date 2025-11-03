using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Restaurant.RegisterDeviceToken;

public record RegisterDeviceTokenCommand(
    Guid RestaurantId,
    string ExpoPushToken,
    string DeviceType
) : ICommand<RegisterDeviceTokenResult>;

public record RegisterDeviceTokenResult(
    bool Success,
    string Message
);
