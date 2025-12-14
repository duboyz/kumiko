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

    // Business hours from Google Places API
    public string? BusinessHours { get; set; } // JSON string of weekday_text array
    public bool? IsOpenNow { get; set; }

    // Localization settings
    public Currency Currency { get; set; } = Currency.USD;

    // Stripe Connect integration
    public string? StripeConnectAccountId { get; set; }
    public bool StripeConnectOnboardingComplete { get; set; }
    public bool StripeConnectChargesEnabled { get; set; }

    public ICollection<UserRestaurant> Staff { get; set; } = [];
    public ICollection<RestaurantMenu> Menus { get; set; } = [];
}
