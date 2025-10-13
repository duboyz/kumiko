using BackendApi.Data;
using BackendApi.Entities;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Services;

public class SubscriptionService(ApplicationDbContext context) : ISubscriptionService
{
    public async Task<bool> CanCreateRestaurantAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var subscription = await context.UserSubscriptions
            .Include(s => s.SubscriptionPlan)
            .FirstOrDefaultAsync(s => s.UserId == userId, cancellationToken);

        // If no subscription or subscription is not active/trialing, check if they're in trial period
        if (subscription == null)
        {
            // Allow one restaurant during trial (basic plan default)
            return true;
        }

        // Check if subscription is active or trialing
        if (subscription.Status != SubscriptionStatus.Active && subscription.Status != SubscriptionStatus.Trialing)
        {
            return false;
        }

        var currentRestaurantCount = await context.UserRestaurants
            .Where(ur => ur.UserId == userId)
            .CountAsync(cancellationToken);

        var maxLocations = subscription.SubscriptionPlan.MaxLocations;

        // -1 means unlimited
        if (maxLocations == -1)
        {
            return true;
        }

        return currentRestaurantCount < maxLocations;
    }

    public async Task<bool> CanCreateMenuAsync(Guid restaurantId, CancellationToken cancellationToken = default)
    {
        // Get the owner of the restaurant
        var userRestaurant = await context.UserRestaurants
            .Where(ur => ur.RestaurantId == restaurantId && ur.Role == UserRole.Owner)
            .FirstOrDefaultAsync(cancellationToken);

        if (userRestaurant == null)
        {
            return false;
        }

        var subscription = await context.UserSubscriptions
            .Include(s => s.SubscriptionPlan)
            .FirstOrDefaultAsync(s => s.UserId == userRestaurant.UserId, cancellationToken);

        // If no subscription, allow default (basic plan) limits
        if (subscription == null)
        {
            var currentMenuCount = await context.RestaurantMenus
                .Where(m => m.RestaurantId == restaurantId && !m.IsDeleted)
                .CountAsync(cancellationToken);

            return currentMenuCount < 3; // Basic plan default
        }

        // Check if subscription is active or trialing
        if (subscription.Status != SubscriptionStatus.Active && subscription.Status != SubscriptionStatus.Trialing)
        {
            return false;
        }

        var menuCount = await context.RestaurantMenus
            .Where(m => m.RestaurantId == restaurantId && !m.IsDeleted)
            .CountAsync(cancellationToken);

        var maxMenus = subscription.SubscriptionPlan.MaxMenusPerLocation;

        // -1 means unlimited
        if (maxMenus == -1)
        {
            return true;
        }

        return menuCount < maxMenus;
    }

    public async Task<int> GetMaxLocationsAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var subscription = await context.UserSubscriptions
            .Include(s => s.SubscriptionPlan)
            .FirstOrDefaultAsync(s => s.UserId == userId, cancellationToken);

        if (subscription == null || (subscription.Status != SubscriptionStatus.Active && subscription.Status != SubscriptionStatus.Trialing))
        {
            return 1; // Basic plan default
        }

        return subscription.SubscriptionPlan.MaxLocations;
    }

    public async Task<int> GetMaxMenusPerLocationAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var subscription = await context.UserSubscriptions
            .Include(s => s.SubscriptionPlan)
            .FirstOrDefaultAsync(s => s.UserId == userId, cancellationToken);

        if (subscription == null || (subscription.Status != SubscriptionStatus.Active && subscription.Status != SubscriptionStatus.Trialing))
        {
            return 3; // Basic plan default
        }

        return subscription.SubscriptionPlan.MaxMenusPerLocation;
    }

    public async Task<bool> HasActiveSubscriptionAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var subscription = await context.UserSubscriptions
            .FirstOrDefaultAsync(s => s.UserId == userId, cancellationToken);

        if (subscription == null)
        {
            // Check if user's trial period has expired (30 days from registration)
            var user = await context.Users.FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);
            if (user == null) return false;

            // If registered more than 30 days ago, trial has expired
            if (user.CreatedAt.AddDays(30) < DateTime.UtcNow)
            {
                return false;
            }

            // Still in trial period
            return true;
        }

        return subscription.Status == SubscriptionStatus.Active || subscription.Status == SubscriptionStatus.Trialing;
    }
}
