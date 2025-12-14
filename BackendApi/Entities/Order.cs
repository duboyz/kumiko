namespace BackendApi.Entities;

public enum OrderStatus
{
    Pending,
    Confirmed,
    Ready,
    Completed,
    Cancelled
}

public enum PaymentStatus
{
    NotRequired,
    Pending,
    Paid,
    Failed,
    Refunded
}

public class Order : BaseEntity
{
    // Optional link to registered customer
    public Guid? CustomerId { get; set; }
    public User? Customer { get; set; }

    // Customer information (either from linked user or provided directly)
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public DateTime PickupDate { get; set; }
    public TimeSpan PickupTime { get; set; }
    public string AdditionalNote { get; set; } = string.Empty;
    public OrderStatus Status { get; set; } = OrderStatus.Pending;

    public Guid RestaurantId { get; set; }
    public Restaurant Restaurant { get; set; } = null!;

    public Guid RestaurantMenuId { get; set; }
    public RestaurantMenu RestaurantMenu { get; set; } = null!;

    public ICollection<OrderItem> OrderItems { get; set; } = [];

    // Payment information
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.NotRequired;
    public string? StripePaymentIntentId { get; set; }
    public decimal? PlatformFeeAmount { get; set; }
    public decimal TotalAmount { get; set; }
}

