namespace BackendApi.Entities;

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

