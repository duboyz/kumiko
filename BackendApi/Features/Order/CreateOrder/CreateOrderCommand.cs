using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Order.CreateOrder;

public record CreateOrderCommand(
    Guid? CustomerId,
    string CustomerName,
    string CustomerPhone,
    string CustomerEmail,
    DateTime PickupDate,
    TimeSpan PickupTime,
    string AdditionalNote,
    Guid RestaurantId,
    Guid RestaurantMenuId,
    List<CreateOrderItemDto> OrderItems
) : ICommand<CreateOrderResult>;

public record CreateOrderItemDto(
    Guid MenuItemId,
    Guid? MenuItemOptionId,
    int Quantity,
    string? SpecialInstructions
);

public record CreateOrderResult(
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
    Guid RestaurantMenuId
);

