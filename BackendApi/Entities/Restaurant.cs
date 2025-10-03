namespace BackendApi.Entities;

public class Restaurant : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }

    public string GooglePlaceId { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string Zip { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string Latitude { get; set; } = string.Empty;
    public string Longitude { get; set; } = string.Empty;

    // Localization settings
    public Currency Currency { get; set; } = Currency.USD;

    public ICollection<UserRestaurant> Staff { get; set; } = [];
    public ICollection<RestaurantMenu> Menus { get; set; } = [];
    public ICollection<Order> Orders { get; set; } = [];
}
