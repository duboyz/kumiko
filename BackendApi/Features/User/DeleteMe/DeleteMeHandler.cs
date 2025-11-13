using BackendApi.Data;
using BackendApi.Repositories.UserRepository;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace BackendApi.Features.User.DeleteMe;

public class DeleteMeHandler(
    IUserRepository userRepository,
    ApplicationDbContext context,
    IConfiguration configuration,
    ILogger<DeleteMeHandler> logger) : ICommandHandler<DeleteMeCommand>
{
    public async Task Handle(DeleteMeCommand request, CancellationToken cancellationToken)
    {
        var user = await userRepository.GetByIdAsync(request.UserId);

        if (user == null)
        {
            throw new KeyNotFoundException("User not found");
        }

        if (user.Email != request.Email)
        {
            throw new InvalidOperationException("Email does not match");
        }

        // check that password is correct
        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            throw new InvalidOperationException("Password is incorrect");
        }

        // Get the user's restaurants (locations)
        var userRestaurants = await context.UserRestaurants
            .Include(ur => ur.Restaurant)
            .Where(ur => ur.UserId == request.UserId)
            .ToListAsync(cancellationToken);

        // Get user's subscription
        var userSubscription = await context.UserSubscriptions
            .FirstOrDefaultAsync(s => s.UserId == request.UserId, cancellationToken);

        // Cancel Stripe subscription if it exists
        if (userSubscription?.StripeSubscriptionId != null)
        {
            try
            {
                StripeConfiguration.ApiKey = configuration["Stripe:SecretKey"];
                var subscriptionService = new SubscriptionService();

                // Delete immediately (not at period end) since user is deleting account
                await subscriptionService.CancelAsync(
                    userSubscription.StripeSubscriptionId,
                    new SubscriptionCancelOptions
                    {
                        InvoiceNow = false,
                        Prorate = true
                    },
                    cancellationToken: cancellationToken
                );

                logger.LogInformation("Canceled Stripe subscription for user: {UserId}", request.UserId);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error canceling Stripe subscription for user: {UserId}", request.UserId);
                // Continue with account deletion even if Stripe cancellation fails
            }
        }

        // Delete restaurants where user is the only staff member
        foreach (var userRestaurant in userRestaurants)
        {
            var restaurantStaffCount = await context.UserRestaurants
                .CountAsync(ur => ur.RestaurantId == userRestaurant.RestaurantId, cancellationToken);

            if (restaurantStaffCount == 1)
            {
                // User is the only staff member, need to delete the restaurant
                // First, delete all orders associated with the restaurant
                var orders = await context.Orders
                    .Where(o => o.RestaurantId == userRestaurant.RestaurantId)
                    .ToListAsync(cancellationToken);

                if (orders.Count > 0)
                {
                    context.Orders.RemoveRange(orders);
                    logger.LogInformation("Deleting {OrderCount} orders for restaurant {RestaurantId}",
                        orders.Count, userRestaurant.RestaurantId);
                }

                // Now delete the restaurant
                context.Restaurants.Remove(userRestaurant.Restaurant);
                logger.LogInformation("Deleting restaurant {RestaurantId} as user {UserId} is the only staff member",
                    userRestaurant.RestaurantId, request.UserId);
            }
        }

        // Delete the user (this will cascade delete UserRestaurants and UserSubscription)
        await userRepository.DeleteAsync(user.Id);

        logger.LogInformation("User account deleted successfully: {UserId}", request.UserId);
    }
}