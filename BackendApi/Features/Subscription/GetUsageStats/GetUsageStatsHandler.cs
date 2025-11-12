using BackendApi.Data;
using BackendApi.Entities;
using BackendApi.Extensions;
using BackendApi.Services;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.Subscription.GetUsageStats;

public class GetUsageStatsHandler(
    ApplicationDbContext context,
    IHttpContextAccessor httpContextAccessor,
    ISubscriptionService subscriptionService)
    : IQueryHandler<GetUsageStatsQuery, GetUsageStatsResult>
{
    public async Task<GetUsageStatsResult> Handle(GetUsageStatsQuery request, CancellationToken cancellationToken)
    {
        var userId = httpContextAccessor.GetCurrentUserId();

        // Get current restaurant count
        var currentLocations = await context.UserRestaurants
            .Where(ur => ur.UserId == userId && ur.Role == UserRole.Owner)
            .CountAsync(cancellationToken);

        // Get maximum menus count across all restaurants
        var restaurantIds = await context.UserRestaurants
            .Where(ur => ur.UserId == userId && ur.Role == UserRole.Owner)
            .Select(ur => ur.RestaurantId)
            .ToListAsync(cancellationToken);

        var currentMenusPerLocation = 0;
        if (restaurantIds.Any())
        {
            // Get the maximum menu count from any single restaurant
            currentMenusPerLocation = await context.RestaurantMenus
                .Where(m => restaurantIds.Contains(m.RestaurantId) && !m.IsDeleted)
                .GroupBy(m => m.RestaurantId)
                .Select(g => g.Count())
                .OrderByDescending(count => count)
                .FirstOrDefaultAsync(cancellationToken);
        }

        // Get subscription limits
        var maxLocations = await subscriptionService.GetMaxLocationsAsync(userId, cancellationToken);
        var maxMenusPerLocation = await subscriptionService.GetMaxMenusPerLocationAsync(userId, cancellationToken);

        // Check if unlimited (-1 represents unlimited)
        var isUnlimitedLocations = maxLocations == -1;
        var isUnlimitedMenus = maxMenusPerLocation == -1;

        return new GetUsageStatsResult(
            currentLocations,
            isUnlimitedLocations ? int.MaxValue : maxLocations,
            currentMenusPerLocation,
            isUnlimitedMenus ? int.MaxValue : maxMenusPerLocation,
            isUnlimitedLocations,
            isUnlimitedMenus
        );
    }
}