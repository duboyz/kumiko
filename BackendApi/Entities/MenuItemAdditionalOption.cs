namespace BackendApi.Entities;

public class MenuItemAdditionalOption : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; } = 0; // Additional price for this extra
    public int OrderIndex { get; set; } = 0; // For sorting add-ons in display order
    public bool IsAvailable { get; set; } = true; // Can be toggled on/off

    public Guid MenuItemId { get; set; }
    public MenuItem MenuItem { get; set; } = null!;
}

