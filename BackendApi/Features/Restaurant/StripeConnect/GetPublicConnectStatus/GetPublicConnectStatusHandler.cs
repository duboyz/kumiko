using BackendApi.Data;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.Restaurant.StripeConnect.GetPublicConnectStatus;

public class GetPublicConnectStatusHandler(ApplicationDbContext context)
    : IQueryHandler<GetPublicConnectStatusQuery, GetPublicConnectStatusResult>
{
    public async Task<GetPublicConnectStatusResult> Handle(GetPublicConnectStatusQuery request, CancellationToken cancellationToken)
    {
        var restaurant = await context.Restaurants
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.Id == request.RestaurantId, cancellationToken);

        if (restaurant == null)
        {
            throw new KeyNotFoundException("Restaurant not found");
        }

        var isConnected = !string.IsNullOrEmpty(restaurant.StripeConnectAccountId);
        var chargesEnabled = restaurant.StripeConnectChargesEnabled;

        return new GetPublicConnectStatusResult(isConnected, chargesEnabled);
    }
}


