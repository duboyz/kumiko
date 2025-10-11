using BackendApi.Models.Restaurant;
using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Restaurant.UpdateRestaurant;

public record UpdateRestaurantCommand(
    Guid Id,
    string? Name,
    string? Description,
    string? Address,
    string? City,
    string? State,
    string? Zip,
    string? Country,
    string? Latitude,
    string? Longitude,
    string? GooglePlaceId,
    string? BusinessHours,
    bool? IsOpenNow
) : ICommand<RestaurantBaseDto>;