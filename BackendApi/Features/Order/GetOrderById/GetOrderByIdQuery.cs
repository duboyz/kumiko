using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Order.GetOrderById;

public record GetOrderByIdQuery(Guid OrderId) : IQuery<GetOrderByIdResult>;

public record GetOrderByIdResult(
    Guid Id,
    string CustomerName,
    string CustomerPhone,
    string CustomerEmail,
    DateTime PickupDate,
    string PickupTime,
    string AdditionalNote,
    string Status,
    decimal TotalAmount,
    RestaurantInfoDto Restaurant,
    List<OrderItemDto> OrderItems,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record RestaurantInfoDto(
    Guid Id,
    string Name,
    string Address,
    string City,
    string Currency
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
