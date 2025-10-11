namespace BackendApi.Models.Restaurant;

public static class RestaurantMappers
{
    public static RestaurantBaseDto ToBaseDto(this Entities.Restaurant restaurant)
    {
        if (restaurant == null)
        {
            throw new ArgumentNullException(nameof(restaurant), "Restaurant cannot be null");
        }

        return new RestaurantBaseDto(
            restaurant.Id,
            restaurant.Name ?? string.Empty,
            restaurant.GooglePlaceId ?? string.Empty,
            restaurant.Address ?? string.Empty,
            restaurant.City ?? string.Empty,
            restaurant.State ?? string.Empty,
            restaurant.Zip ?? string.Empty,
            restaurant.Country ?? string.Empty,
            restaurant.Latitude ?? string.Empty,
            restaurant.Longitude ?? string.Empty,
            restaurant.Currency,
            restaurant.BusinessHours,
            restaurant.IsOpenNow,
            restaurant.Description
        );
    }
}