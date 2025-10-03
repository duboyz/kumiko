namespace BackendApi.Entities;

public class OrderItem : BaseEntity
{
    public Guid OrderId { get; set; }
    public Order Order { get; set; } = null!;

    public Guid MenuItemId { get; set; }
    public MenuItem MenuItem { get; set; } = null!;

    // Snapshot of item details at time of order
    public string ItemName { get; set; } = string.Empty;
    public string ItemDescription { get; set; } = string.Empty;
    public decimal ItemPrice { get; set; }

    public int Quantity { get; set; }
    public decimal Subtotal { get; set; }

    public string? SpecialInstructions { get; set; }
}
