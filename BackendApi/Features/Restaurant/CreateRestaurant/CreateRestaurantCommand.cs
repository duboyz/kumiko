using BackendApi.Models.Restaurant;
using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Restaurant.CreateRestaurant;

public record CreateRestaurantCommand(
    string Name,
    string Address,
    string City,
    string State,
    string Zip,
    string Country,
    string Latitude,
    string Longitude,
    string GooglePlaceId
) : ICommand<RestaurantBaseDto>;
