using BackendApi.Entities;
using BackendApi.Models.Restaurant;
using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Restaurant.GetUserRestaurants;

public record GetUserRestaurantsQuery(
    List<UserRole>? Roles = null
) : IQuery<GetUserRestaurantsResult>;

public record GetUserRestaurantsResult(
    List<UserRestaurantDto> Restaurants
);

public record UserRestaurantDto(
    RestaurantBaseDto Restaurant,
    string Role
);