using BackendApi.Data;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.Order.GetOrderById;

public class GetOrderByIdHandler(ApplicationDbContext context) : IQueryHandler<GetOrderByIdQuery, GetOrderByIdResult>
{
    public async Task<GetOrderByIdResult> Handle(GetOrderByIdQuery request, CancellationToken cancellationToken)
    {
        var order = await context.Orders
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.MenuItem)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.MenuItemOption)
            .Include(o => o.Restaurant)
            .FirstOrDefaultAsync(o => o.Id == request.OrderId, cancellationToken);

        if (order == null)
        {
            throw new ArgumentException("Order not found");
        }

        var orderDto = new GetOrderByIdResult(
            order.Id,
            order.CustomerName,
            order.CustomerPhone,
            order.CustomerEmail,
            order.PickupDate,
            order.PickupTime.ToString(@"hh\:mm\:ss"),
            order.AdditionalNote,
            order.Status.ToString(),
            order.OrderItems.Sum(oi => oi.PriceAtOrder * oi.Quantity),
            new RestaurantInfoDto(
                order.Restaurant.Id,
                order.Restaurant.Name,
                order.Restaurant.Address,
                order.Restaurant.City,
                order.Restaurant.Currency.ToString()
            ),
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
        );

        return orderDto;
    }
}
