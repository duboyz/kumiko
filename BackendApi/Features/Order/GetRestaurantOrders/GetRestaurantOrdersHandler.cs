using BackendApi.Data;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.Order.GetRestaurantOrders;

public class GetRestaurantOrdersHandler(ApplicationDbContext context) : IQueryHandler<GetRestaurantOrdersQuery, GetRestaurantOrdersResult>
{
    public async Task<GetRestaurantOrdersResult> Handle(GetRestaurantOrdersQuery request, CancellationToken cancellationToken)
    {
        // Verify restaurant exists
        var restaurant = await context.Restaurants
            .FirstOrDefaultAsync(r => r.Id == request.RestaurantId, cancellationToken);

        if (restaurant == null)
        {
            throw new ArgumentException("Restaurant not found");
        }

        var orders = await context.Orders
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.MenuItem)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.MenuItemOption)
            .Where(o => o.RestaurantId == request.RestaurantId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync(cancellationToken);

        var orderDtos = orders.Select(order => new OrderDto(
            order.Id,
            order.CustomerName,
            order.CustomerPhone,
            order.CustomerEmail,
            order.PickupDate,
            order.PickupTime.ToString(@"hh\:mm\:ss"),
            order.AdditionalNote,
            order.Status.ToString(),
            order.OrderItems.Sum(oi => oi.PriceAtOrder * oi.Quantity),
            order.RestaurantId,
            order.RestaurantMenuId,
            order.OrderItems.Select(oi => new OrderItemDto(
                oi.Id,
                oi.MenuItemId,
                oi.MenuItem.Name,
                oi.MenuItemOptionId,
                oi.MenuItemOption?.Name,
                oi.Quantity,
                oi.PriceAtOrder,
                oi.SpecialInstructions
            )).ToList(),
            order.CreatedAt,
            order.UpdatedAt ?? DateTime.UtcNow
        )).ToList();

        return new GetRestaurantOrdersResult(orderDtos);
    }
}

