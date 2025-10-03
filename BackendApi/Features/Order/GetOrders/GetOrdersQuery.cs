using BackendApi.Entities;
using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Order.GetOrders;

public record GetOrdersQuery() : IQuery<GetOrdersResult>;

public record OrderDto(
    Guid Id,
    Guid RestaurantId,
    string RestaurantName,
    string CustomerName,
    string CustomerEmail,
    string CustomerPhone,
    DateTime PickupDateTime,
    OrderStatus Status,
    decimal TotalAmount,
    string? Notes,
    DateTime CreatedAt,
    List<OrderItemDto> Items
);

public record OrderItemDto(
    Guid Id,
    string ItemName,
    string ItemDescription,
    decimal ItemPrice,
    int Quantity,
    decimal Subtotal,
    string? SpecialInstructions
);

public record GetOrdersResult(
    List<OrderDto> Orders
);
