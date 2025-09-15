using BackendApi.Models.Restaurant;
using BackendApi.Repositories;
using BackendApi.Shared.Contracts;
using BackendApi.Entities;
using BackendApi.Extensions;

namespace BackendApi.Features.Restaurant.CreateRestaurant;

public class CreateRestaurantHandler(
    IRestaurantRepository restaurantRepository,
    IUserRestaurantRepository userRestaurantRepository,
    IHttpContextAccessor httpContextAccessor
) : ICommandHandler<CreateRestaurantCommand, RestaurantBaseDto>
{
    public async Task<RestaurantBaseDto> Handle(CreateRestaurantCommand request, CancellationToken cancellationToken)
    {
        var userId = httpContextAccessor.GetCurrentUserId();

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
            GooglePlaceId = request.GooglePlaceId
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