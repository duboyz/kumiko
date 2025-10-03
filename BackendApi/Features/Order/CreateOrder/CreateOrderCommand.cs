using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Order.CreateOrder;

public record OrderItemCommand(
    Guid MenuItemId,
    int Quantity,
    string? SpecialInstructions
);

public record CreateOrderCommand(
    Guid RestaurantId,
    string CustomerName,
    string CustomerEmail,
    string CustomerPhone,
    DateTime PickupDateTime,
    string? Notes,
    List<OrderItemCommand> Items
) : ICommand<CreateOrderResult>;

public record CreateOrderResult(
    Guid OrderId,
    decimal TotalAmount
);
