using BackendApi.Data;
using BackendApi.Extensions;
using BackendApi.Repositories;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.Restaurant.StripeConnect.GetConnectStatus;

public class GetConnectStatusHandler(
    ApplicationDbContext context,
    IHttpContextAccessor httpContextAccessor) : IQueryHandler<GetConnectStatusQuery, GetConnectStatusResult>
{
    public async Task<GetConnectStatusResult> Handle(GetConnectStatusQuery request, CancellationToken cancellationToken)
    {
        var userId = httpContextAccessor.GetCurrentUserId();

        // Verify restaurant exists and user has access
        var restaurant = await context.Restaurants
            .Include(r => r.Staff)
            .FirstOrDefaultAsync(r => r.Id == request.RestaurantId, cancellationToken);

        if (restaurant == null)
        {
            throw new KeyNotFoundException("Restaurant not found");
        }

        // Check if user is associated with this restaurant
        var userRestaurant = restaurant.Staff.FirstOrDefault(ur => ur.UserId == userId);
        if (userRestaurant == null)
        {
            throw new UnauthorizedAccessException("You do not have access to this restaurant");
        }

        return new GetConnectStatusResult(
            IsConnected: !string.IsNullOrEmpty(restaurant.StripeConnectAccountId),
            OnboardingComplete: restaurant.StripeConnectOnboardingComplete,
            ChargesEnabled: restaurant.StripeConnectChargesEnabled,
            AccountId: restaurant.StripeConnectAccountId
        );
    }
}

