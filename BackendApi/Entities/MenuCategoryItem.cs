namespace BackendApi.Entities;

// Join table for many-to-many relationship between MenuCategory and MenuItem with ordering
public class MenuCategoryItem : BaseEntity
{
    public Guid MenuCategoryId { get; set; }
    public MenuCategory MenuCategory { get; set; } = null!;

    public Guid MenuItemId { get; set; }
    public MenuItem MenuItem { get; set; } = null!;

    public int OrderIndex { get; set; } = 0;
}

