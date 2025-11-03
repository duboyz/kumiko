using BackendApi.Data;
using BackendApi.Entities;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.Restaurant.RegisterDeviceToken;

public class RegisterDeviceTokenHandler(ApplicationDbContext context)
    : ICommandHandler<RegisterDeviceTokenCommand, RegisterDeviceTokenResult>
{
    public async Task<RegisterDeviceTokenResult> Handle(
        RegisterDeviceTokenCommand request,
        CancellationToken cancellationToken)
    {
        // Check if restaurant exists
        var restaurant = await context.Restaurants
            .FirstOrDefaultAsync(r => r.Id == request.RestaurantId, cancellationToken);

        if (restaurant == null)
        {
            throw new ArgumentException("Restaurant not found");
        }

        // Check if device token already exists for this restaurant
        var existingToken = await context.DeviceTokens
            .FirstOrDefaultAsync(
                dt => dt.RestaurantId == request.RestaurantId &&
                      dt.ExpoPushToken == request.ExpoPushToken,
                cancellationToken);

        if (existingToken != null)
        {
            // Update last registered timestamp
            existingToken.LastRegisteredAt = DateTime.UtcNow;
            existingToken.DeviceType = request.DeviceType;
        }
        else
        {
            // Create new device token
            var deviceToken = new DeviceToken
            {
                RestaurantId = request.RestaurantId,
                ExpoPushToken = request.ExpoPushToken,
                DeviceType = request.DeviceType,
                LastRegisteredAt = DateTime.UtcNow
            };

            context.DeviceTokens.Add(deviceToken);
        }

        await context.SaveChangesAsync(cancellationToken);

        return new RegisterDeviceTokenResult(true, "Device registered successfully");
    }
}
