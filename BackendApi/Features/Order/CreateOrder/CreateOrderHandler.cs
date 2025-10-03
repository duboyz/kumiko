using BackendApi.Data;
using BackendApi.Extensions;
using BackendApi.Repositories;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.Order.CreateOrder;

public class CreateOrderHandler(
    ApplicationDbContext context,
    IHttpContextAccessor httpContextAccessor) : ICommandHandler<CreateOrderCommand, CreateOrderResult>
{
    public async Task<CreateOrderResult> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        // Get userId if authenticated (optional)
        Guid? userId = null;
        try
        {
            userId = httpContextAccessor.GetCurrentUserId();
        }
        catch
        {
            // User is not authenticated - this is fine for guest orders
        }

        // Validate restaurant exists
        var restaurant = await context.Restaurants
            .FirstOrDefaultAsync(r => r.Id == request.RestaurantId, cancellationToken);

        if (restaurant == null)
        {
            throw new InvalidOperationException("Restaurant not found");
        }

        // Get menu items with prices
        var menuItemIds = request.Items.Select(i => i.MenuItemId).ToList();
        var menuItems = await context.MenuItems
            .Where(mi => menuItemIds.Contains(mi.Id) && mi.IsAvailable)
            .ToDictionaryAsync(mi => mi.Id, cancellationToken);

        // Validate all items exist and are available
        foreach (var item in request.Items)
        {
            if (!menuItems.ContainsKey(item.MenuItemId))
            {
                throw new InvalidOperationException($"Menu item not found or unavailable: {item.MenuItemId}");
            }
        }

        // Calculate total
        decimal totalAmount = 0;
        var orderItems = new List<Entities.OrderItem>();

        foreach (var item in request.Items)
        {
            var menuItem = menuItems[item.MenuItemId];
            var subtotal = menuItem.Price * item.Quantity;
            totalAmount += subtotal;

            orderItems.Add(new Entities.OrderItem
            {
                MenuItemId = item.MenuItemId,
                ItemName = menuItem.Name,
                ItemDescription = menuItem.Description,
                ItemPrice = menuItem.Price,
                Quantity = item.Quantity,
                Subtotal = subtotal,
                SpecialInstructions = item.SpecialInstructions
            });
        }

        // Create order
        var order = new Entities.Order
        {
            UserId = userId,
            RestaurantId = request.RestaurantId,
            CustomerName = request.CustomerName,
            CustomerEmail = request.CustomerEmail,
            CustomerPhone = request.CustomerPhone,
            PickupDateTime = request.PickupDateTime,
            Notes = request.Notes,
            TotalAmount = totalAmount,
            Status = Entities.OrderStatus.Pending,
            OrderItems = orderItems
        };

        context.Orders.Add(order);
        await context.SaveChangesAsync(cancellationToken);

        return new CreateOrderResult(order.Id, totalAmount);
    }
}
