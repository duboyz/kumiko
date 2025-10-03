using BackendApi.Data;
using BackendApi.Extensions;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.Order.GetOrders;

public class GetOrdersHandler(
    ApplicationDbContext context,
    IHttpContextAccessor httpContextAccessor) : IQueryHandler<GetOrdersQuery, GetOrdersResult>
{
    public async Task<GetOrdersResult> Handle(GetOrdersQuery request, CancellationToken cancellationToken)
    {
        var userId = httpContextAccessor.GetCurrentUserId();

        var orders = await context.Orders
            .Include(o => o.Restaurant)
            .Include(o => o.OrderItems)
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync(cancellationToken);

        var orderDtos = orders.Select(o => new OrderDto(
            o.Id,
            o.RestaurantId,
            o.Restaurant.Name,
            o.CustomerName,
            o.CustomerEmail,
            o.CustomerPhone,
            o.PickupDateTime,
            o.Status,
            o.TotalAmount,
            o.Notes,
            o.CreatedAt,
            o.OrderItems.Select(oi => new OrderItemDto(
                oi.Id,
                oi.ItemName,
                oi.ItemDescription,
                oi.ItemPrice,
                oi.Quantity,
                oi.Subtotal,
                oi.SpecialInstructions
            )).ToList()
        )).ToList();

        return new GetOrdersResult(orderDtos);
    }
}
