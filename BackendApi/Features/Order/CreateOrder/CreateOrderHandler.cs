using BackendApi.Data;
using BackendApi.Entities;
using BackendApi.Services;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.Order.CreateOrder;

public class CreateOrderHandler(
    ApplicationDbContext context,
    IExpoNotificationService notificationService,
    ILogger<CreateOrderHandler> logger) : ICommandHandler<CreateOrderCommand, CreateOrderResult>
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

        // If customer is authenticated, optionally get their saved info
        string customerName = request.CustomerName;
        string customerPhone = request.CustomerPhone;
        string customerEmail = request.CustomerEmail;

        if (request.CustomerId.HasValue)
        {
            var customer = await context.Users
                .FirstOrDefaultAsync(u => u.Id == request.CustomerId.Value, cancellationToken);

            if (customer != null)
            {
                // Use saved customer info if not provided in request
                if (string.IsNullOrWhiteSpace(customerName) && !string.IsNullOrWhiteSpace(customer.FirstName))
                {
                    customerName = $"{customer.FirstName} {customer.LastName}".Trim();
                }
                if (string.IsNullOrWhiteSpace(customerPhone))
                {
                    customerPhone = customer.PhoneNumber ?? string.Empty;
                }
                if (string.IsNullOrWhiteSpace(customerEmail))
                {
                    customerEmail = customer.Email;
                }
            }
        }

        // Create order
        var order = new Entities.Order
        {
            Id = Guid.NewGuid(),
            CustomerId = request.CustomerId,
            CustomerName = customerName.Trim(),
            CustomerPhone = customerPhone.Trim(),
            CustomerEmail = customerEmail.Trim(),
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

        // Send push notifications to all devices registered for this restaurant
        try
        {
            var deviceTokens = await context.DeviceTokens
                .Where(dt => dt.RestaurantId == order.RestaurantId)
                .Select(dt => dt.ExpoPushToken)
                .ToListAsync(cancellationToken);

            if (deviceTokens.Count > 0)
            {
                var notificationData = new Dictionary<string, object>
                {
                    { "orderId", order.Id.ToString() },
                    { "restaurantId", order.RestaurantId.ToString() },
                    { "type", "new_order" }
                };

                await notificationService.SendPushNotificationsAsync(
                    deviceTokens,
                    "New Order Received! 🎉",
                    $"Order from {order.CustomerName} - {totalAmount:C}",
                    notificationData
                );

                logger.LogInformation($"Sent push notifications for order {order.Id} to {deviceTokens.Count} devices");
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, $"Failed to send push notifications for order {order.Id}");
            // Don't fail the order creation if push notifications fail
        }

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

