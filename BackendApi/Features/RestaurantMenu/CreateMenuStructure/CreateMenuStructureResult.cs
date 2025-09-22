namespace BackendApi.Features.RestaurantMenu.CreateMenuStructure;

public class CreateMenuStructureResult
{
    public Guid MenuId { get; set; }
    public string MenuName { get; set; } = string.Empty;
    public string MenuDescription { get; set; } = string.Empty;
    public List<CreatedCategoryResult> Categories { get; set; } = [];
    public int TotalItemsCreated { get; set; }
    public int TotalCategoriesCreated { get; set; }
}

public class CreatedCategoryResult
{
    public Guid CategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int OrderIndex { get; set; }
    public List<CreatedMenuItemResult> Items { get; set; } = [];
}

public class CreatedMenuItemResult
{
    public Guid ItemId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int OrderIndex { get; set; }
    public bool IsAvailable { get; set; }
}
