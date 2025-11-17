using BackendApi.Data;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.Order.GetCustomerOrders;

public class GetCustomerOrdersHandler(
    ApplicationDbContext context) : IQueryHandler<GetCustomerOrdersQuery, List<CustomerOrderDto>>
{
    public async Task<List<CustomerOrderDto>> Handle(GetCustomerOrdersQuery request, CancellationToken cancellationToken)
    {
        var orders = await context.Orders
            .Include(o => o.Restaurant)
            .Include(o => o.OrderItems)
            .Where(o => o.CustomerId == request.CustomerId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync(cancellationToken);

        return orders.Select(o => new CustomerOrderDto(
            o.Id,
            o.CustomerName,
            o.CustomerPhone,
            o.CustomerEmail,
            o.PickupDate,
            o.PickupTime.ToString(@"hh\:mm\:ss"),
            o.Status.ToString(),
            o.OrderItems.Sum(oi => oi.PriceAtOrder * oi.Quantity),
            o.CreatedAt,
            new RestaurantInfoDto(
                o.Restaurant.Id,
                o.Restaurant.Name
            )
        )).ToList();
    }
}

