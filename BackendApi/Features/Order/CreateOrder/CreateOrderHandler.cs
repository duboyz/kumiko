using BackendApi.Data;
using BackendApi.Entities;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.Order.CreateOrder;

public class CreateOrderHandler(ApplicationDbContext context) : ICommandHandler<CreateOrderCommand, CreateOrderResult>
{
    public async Task<CreateOrderResult> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        // Verify restaurant exists
        var restaurant = await context.Restaurants
            .FirstOrDefaultAsync(r => r.Id == request.RestaurantId, cancellationToken);

        if (restaurant == null)
        {
            throw new ArgumentException("Restaurant not found");
        }

        // Verify restaurant menu exists
        var restaurantMenu = await context.RestaurantMenus
            .FirstOrDefaultAsync(m => m.Id == request.RestaurantMenuId, cancellationToken);

        if (restaurantMenu == null)
        {
            throw new ArgumentException("Restaurant menu not found");
        }

        // Validation
        if (string.IsNullOrWhiteSpace(request.CustomerName))
        {
            throw new ArgumentException("Customer name is required");
        }

        if (string.IsNullOrWhiteSpace(request.CustomerPhone))
        {
            throw new ArgumentException("Customer phone is required");
        }

        if (string.IsNullOrWhiteSpace(request.CustomerEmail))
        {
            throw new ArgumentException("Customer email is required");
        }

        if (request.OrderItems == null || request.OrderItems.Count == 0)
        {
            throw new ArgumentException("Order must have at least one item");
        }

        // Create order
        var order = new Entities.Order
        {
            Id = Guid.NewGuid(),
            CustomerName = request.CustomerName.Trim(),
            CustomerPhone = request.CustomerPhone.Trim(),
            CustomerEmail = request.CustomerEmail.Trim(),
            PickupDate = request.PickupDate,
            PickupTime = request.PickupTime,
            AdditionalNote = request.AdditionalNote?.Trim() ?? string.Empty,
            Status = OrderStatus.Pending,
            RestaurantId = request.RestaurantId,
            RestaurantMenuId = request.RestaurantMenuId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        context.Orders.Add(order);

        // Add order items
        decimal totalAmount = 0;
        foreach (var itemDto in request.OrderItems)
        {
            // Verify menu item exists
            var menuItem = await context.MenuItems
                .Include(mi => mi.Options)
                .FirstOrDefaultAsync(mi => mi.Id == itemDto.MenuItemId, cancellationToken);

            if (menuItem == null)
            {
                throw new ArgumentException($"Menu item {itemDto.MenuItemId} not found");
            }

            // Determine price
            decimal price;
            if (itemDto.MenuItemOptionId.HasValue)
            {
                var option = menuItem.Options.FirstOrDefault(o => o.Id == itemDto.MenuItemOptionId.Value);
                if (option == null)
                {
                    throw new ArgumentException($"Menu item option {itemDto.MenuItemOptionId} not found");
                }
                price = option.Price;
            }
            else
            {
                if (!menuItem.Price.HasValue)
                {
                    throw new ArgumentException($"Menu item {itemDto.MenuItemId} requires an option to be selected");
                }
                price = menuItem.Price.Value;
            }

            var orderItem = new OrderItem
            {
                Id = Guid.NewGuid(),
                OrderId = order.Id,
                MenuItemId = itemDto.MenuItemId,
                MenuItemOptionId = itemDto.MenuItemOptionId,
                Quantity = itemDto.Quantity,
                PriceAtOrder = price,
                SpecialInstructions = itemDto.SpecialInstructions?.Trim(),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            context.OrderItems.Add(orderItem);
            totalAmount += price * itemDto.Quantity;
        }

        await context.SaveChangesAsync(cancellationToken);

        return new CreateOrderResult(
            order.Id,
            order.CustomerName,
            order.CustomerPhone,
            order.CustomerEmail,
            order.PickupDate,
            order.PickupTime.ToString(@"hh\:mm\:ss"),
            order.AdditionalNote,
            order.Status.ToString(),
            totalAmount,
            order.RestaurantId,
            order.RestaurantMenuId
        );
    }
}

