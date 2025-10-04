namespace BackendApi.Entities;

public class OrderItem : BaseEntity
{
    public Guid OrderId { get; set; }
    public Order Order { get; set; } = null!;
    
    public Guid MenuItemId { get; set; }
    public MenuItem MenuItem { get; set; } = null!;
    
    public Guid? MenuItemOptionId { get; set; }
    public MenuItemOption? MenuItemOption { get; set; }
    
    public int Quantity { get; set; }
    public decimal PriceAtOrder { get; set; } // Store price at time of order
    public string? SpecialInstructions { get; set; }
}

