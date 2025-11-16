namespace BackendApi.Entities;

public class MenuItem : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal? Price { get; set; } // Nullable - null when HasOptions is true
    public bool HasOptions { get; set; } = false; // Determines if item uses options for pricing
    public bool IsAvailable { get; set; } = true;

    public Guid RestaurantMenuId { get; set; }
    public RestaurantMenu RestaurantMenu { get; set; } = null!;

    public ICollection<MenuCategoryItem> MenuCategoryItems { get; set; } = [];
    public ICollection<MenuItemOption> Options { get; set; } = [];
    public ICollection<MenuItemAdditionalOption> AdditionalOptions { get; set; } = [];
    public ICollection<MenuItemAllergen> Allergens { get; set; } = [];
}

