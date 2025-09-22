namespace BackendApi.Entities;

public class RestaurantMenu : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public Guid RestaurantId { get; set; }
    public Restaurant Restaurant { get; set; } = null!;

    public ICollection<MenuCategory> Categories { get; set; } = [];
}

