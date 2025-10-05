using BackendApi.Models.Restaurant;
using BackendApi.Repositories;
using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Restaurant.UpdateRestaurant;

public class UpdateRestaurantHandler(IRestaurantRepository restaurantRepository) : ICommandHandler<UpdateRestaurantCommand, RestaurantBaseDto>
{
    public async Task<RestaurantBaseDto> Handle(UpdateRestaurantCommand request, CancellationToken cancellationToken)
    {
        var restaurant = await restaurantRepository.RequiredGetByIdAsync(request.Id);

        // Update properties if provided
        if (!string.IsNullOrWhiteSpace(request.Name))
            restaurant.Name = request.Name;

        if (!string.IsNullOrWhiteSpace(request.Address))
            restaurant.Address = request.Address;

        if (!string.IsNullOrWhiteSpace(request.City))
            restaurant.City = request.City;

        if (!string.IsNullOrWhiteSpace(request.State))
            restaurant.State = request.State;

        if (!string.IsNullOrWhiteSpace(request.Zip))
            restaurant.Zip = request.Zip;

        if (!string.IsNullOrWhiteSpace(request.Country))
            restaurant.Country = request.Country;

        if (!string.IsNullOrWhiteSpace(request.Latitude))
            restaurant.Latitude = request.Latitude;

        if (!string.IsNullOrWhiteSpace(request.Longitude))
            restaurant.Longitude = request.Longitude;

        if (!string.IsNullOrWhiteSpace(request.GooglePlaceId))
            restaurant.GooglePlaceId = request.GooglePlaceId;

        restaurant.UpdatedAt = DateTime.UtcNow;
        await restaurantRepository.UpdateAsync(restaurant);

        Console.WriteLine($"Restaurant updated");

        return restaurant.ToBaseDto();
    }
}
