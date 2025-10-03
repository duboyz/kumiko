namespace BackendApi.Entities;

public class MenuItem : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public bool IsAvailable { get; set; } = true;

    public Guid RestaurantMenuId { get; set; }
    public RestaurantMenu RestaurantMenu { get; set; } = null!;

    public ICollection<MenuCategoryItem> MenuCategoryItems { get; set; } = [];
    public ICollection<MenuItemOption> Options { get; set; } = [];
    public ICollection<MenuItemAllergen> Allergens { get; set; } = [];
    public ICollection<OrderItem> OrderItems { get; set; } = [];
}

