namespace BackendApi.Entities;

public enum OrderStatus
{
    Pending,
    Confirmed,
    Preparing,
    Ready,
    PickedUp,
    Cancelled
}

public class Order : BaseEntity
{
    // Customer information (for both guest and authenticated users)
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;

    // Optional user reference (null for guest orders)
    public Guid? UserId { get; set; }
    public User? User { get; set; }

    // Restaurant reference
    public Guid RestaurantId { get; set; }
    public Restaurant Restaurant { get; set; } = null!;

    // Order details
    public DateTime PickupDateTime { get; set; }
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public decimal TotalAmount { get; set; }
    public string? Notes { get; set; }

    // Order items
    public ICollection<OrderItem> OrderItems { get; set; } = [];
}
