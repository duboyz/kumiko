namespace BackendApi.Entities;

public class RestaurantMenu : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public Guid RestaurantId { get; set; }
    public Restaurant Restaurant { get; set; } = null!;

    public ICollection<MenuCategory> Categories { get; set; } = [];
}

public class MenuCategory : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public Guid RestaurantMenuId { get; set; }
    public RestaurantMenu RestaurantMenu { get; set; } = null!;

    public ICollection<MenuItem> MenuItems { get; set; } = [];
}

public class MenuItem : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public bool IsAvailable { get; set; } = true;

    public Guid MenuCategoryId { get; set; }
    public MenuCategory MenuCategory { get; set; } = null!;

    public ICollection<MenuItemOption> Options { get; set; } = [];
    public ICollection<MenuItemAllergen> Allergens { get; set; } = [];
}

public class MenuItemOption : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal PriceModifier { get; set; } = 0; // Additional cost for this option

    public Guid MenuItemId { get; set; }
    public MenuItem MenuItem { get; set; } = null!;

    public ICollection<Allergen> RemovedAllergens { get; set; } = [];
    public ICollection<Allergen> AddedAllergens { get; set; } = [];
}

public class Allergen : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}


public class MenuItemAllergen : BaseEntity
{
    public Guid MenuItemId { get; set; }
    public MenuItem MenuItem { get; set; } = null!;
    public Guid AllergenId { get; set; }
    public Allergen Allergen { get; set; } = null!;
}

