namespace BackendApi.Entities;

public class User : BaseEntity
{
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }

    // Phone number for bookings/orders
    public string? PhoneNumber { get; set; }

    // Localization settings
    public Language PreferredLanguage { get; set; } = Language.English;

    // Refresh token for authentication
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiresAt { get; set; }

    public ICollection<UserRestaurant> Restaurants { get; set; } = [];
    public ICollection<Order> Orders { get; set; } = [];
}
