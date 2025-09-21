using BackendApi.Entities;

namespace BackendApi.Models.Restaurant;

public record RestaurantBaseDto(
    Guid Id,
    string Name,
    string GooglePlaceId,
    string Address,
    string City,
    string State,
    string Zip,
    string Country,
    string Latitude,
    string Longitude,
    Currency Currency
);