using BackendApi.Models.Restaurant;
using BackendApi.Repositories;
using BackendApi.Shared.Contracts;
using BackendApi.Entities;
using BackendApi.Extensions;
using BackendApi.Services;

namespace BackendApi.Features.Restaurant.CreateRestaurant;

public class CreateRestaurantHandler(
    IRestaurantRepository restaurantRepository,
    IUserRestaurantRepository userRestaurantRepository,
    IHttpContextAccessor httpContextAccessor,
    ISubscriptionService subscriptionService
) : ICommandHandler<CreateRestaurantCommand, RestaurantBaseDto>
{
    public async Task<RestaurantBaseDto> Handle(CreateRestaurantCommand request, CancellationToken cancellationToken)
    {
        var userId = httpContextAccessor.GetCurrentUserId();

        // Check subscription limits
        var canCreate = await subscriptionService.CanCreateRestaurantAsync(userId, cancellationToken);
        if (!canCreate)
        {
            throw new Exception("You have reached the maximum number of locations for your subscription plan. Please upgrade to create more locations.");
        }

        // Parse business hours if provided
        string? parsedBusinessHours = null;
        if (!string.IsNullOrEmpty(request.BusinessHours))
        {
            try
            {
                var weekdayText = System.Text.Json.JsonSerializer.Deserialize<List<string>>(request.BusinessHours);
                if (weekdayText != null)
                {
                    parsedBusinessHours = BusinessHoursParser.ParseBusinessHours(weekdayText);
                }
            }
            catch
            {
                // If parsing fails, store the original data
                parsedBusinessHours = request.BusinessHours;
            }
        }

        var restaurant = await restaurantRepository.AddAsync(new Entities.Restaurant
        {
            Name = request.Name,
            Address = request.Address,
            City = request.City,
            State = request.State,
            Zip = request.Zip,
            Country = request.Country,
            Latitude = request.Latitude,
            Longitude = request.Longitude,
            GooglePlaceId = request.GooglePlaceId,
            BusinessHours = parsedBusinessHours,
            IsOpenNow = request.IsOpenNow
        });

        // Create UserRestaurant relationship with Owner role
        await userRestaurantRepository.AddAsync(new UserRestaurant
        {
            UserId = userId,
            RestaurantId = restaurant.Id,
            Role = UserRole.Owner
        });

        return restaurant.ToBaseDto();
    }
}