using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Order.GetCustomerOrders;

public record GetCustomerOrdersQuery(
    Guid CustomerId
) : IQuery<List<CustomerOrderDto>>;

public record CustomerOrderDto(
    Guid Id,
    string CustomerName,
    string CustomerPhone,
    string CustomerEmail,
    DateTime PickupDate,
    string PickupTime,
    string Status,
    decimal TotalAmount,
    DateTime CreatedAt,
    RestaurantInfoDto Restaurant
);

public record RestaurantInfoDto(
    Guid Id,
    string Name
);

