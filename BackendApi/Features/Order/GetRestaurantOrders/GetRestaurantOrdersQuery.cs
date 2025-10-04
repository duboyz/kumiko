using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Order.GetRestaurantOrders;

public record GetRestaurantOrdersQuery(Guid RestaurantId) : IQuery<GetRestaurantOrdersResult>;

public record GetRestaurantOrdersResult(List<OrderDto> Orders);

public record OrderDto(
    Guid Id,
    string CustomerName,
    string CustomerPhone,
    string CustomerEmail,
    DateTime PickupDate,
    string PickupTime,
    string AdditionalNote,
    string Status,
    decimal TotalAmount,
    Guid RestaurantId,
    Guid RestaurantMenuId,
    List<OrderItemDto> OrderItems,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record OrderItemDto(
    Guid Id,
    Guid MenuItemId,
    string MenuItemName,
    Guid? MenuItemOptionId,
    string? MenuItemOptionName,
    int Quantity,
    decimal PriceAtOrder,
    string? SpecialInstructions
);

