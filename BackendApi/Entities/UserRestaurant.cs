namespace BackendApi.Entities;

/// <summary>
/// Junction table for many-to-many relationship between Users and Restaurants
/// Represents staff roles and permissions
/// </summary>
public class UserRestaurant : BaseEntity
{
    public Guid UserId { get; set; }
    public Guid RestaurantId { get; set; }
    public UserRole Role { get; set; } = UserRole.Editor;

    // Navigation properties
    public User User { get; set; } = null!;
    public Restaurant Restaurant { get; set; } = null!;
}
