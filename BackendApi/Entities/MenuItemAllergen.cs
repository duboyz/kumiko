namespace BackendApi.Entities;

public class MenuItemAllergen : BaseEntity
{
    public Guid MenuItemId { get; set; }
    public MenuItem MenuItem { get; set; } = null!;
    public Guid AllergenId { get; set; }
    public Allergen Allergen { get; set; } = null!;
}

