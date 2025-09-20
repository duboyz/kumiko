namespace BackendApi.Entities;

public class MenuCategory : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int OrderIndex { get; set; } = 0;

    public Guid RestaurantMenuId { get; set; }
    public RestaurantMenu RestaurantMenu { get; set; } = null!;

    public ICollection<MenuCategoryItem> MenuCategoryItems { get; set; } = [];
}

