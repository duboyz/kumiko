namespace BackendApi.Entities;

public class MenuItemOption : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; } = 0; // Absolute price for this option
    public decimal PriceModifier { get; set; } = 0; // Kept for backward compatibility
    public int OrderIndex { get; set; } = 0; // For sorting options in display order

    public Guid MenuItemId { get; set; }
    public MenuItem MenuItem { get; set; } = null!;

    public ICollection<Allergen> RemovedAllergens { get; set; } = [];
    public ICollection<Allergen> AddedAllergens { get; set; } = [];
}

