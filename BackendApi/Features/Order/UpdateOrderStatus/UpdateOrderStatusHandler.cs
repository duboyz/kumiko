using BackendApi.Data;
using BackendApi.Entities;
using BackendApi.Services;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.Order.UpdateOrderStatus;

public class UpdateOrderStatusHandler(
    ApplicationDbContext context,
    ITwilioSmsService twilioSmsService) : ICommandHandler<UpdateOrderStatusCommand, UpdateOrderStatusResult>
{
    public async Task<UpdateOrderStatusResult> Handle(UpdateOrderStatusCommand request, CancellationToken cancellationToken)
    {
        var order = await context.Orders
            .Include(o => o.Restaurant)
            .FirstOrDefaultAsync(o => o.Id == request.OrderId, cancellationToken);

        if (order == null)
        {
            throw new ArgumentException("Order not found");
        }

        // Parse and validate status
        if (!Enum.TryParse<OrderStatus>(request.Status, out var status))
        {
            throw new ArgumentException($"Invalid status: {request.Status}. Valid values are: Pending, Confirmed, Ready, Completed, Cancelled");
        }

        order.Status = status;
        order.UpdatedAt = DateTime.UtcNow;

        if (status == OrderStatus.Confirmed && !string.IsNullOrEmpty(order.CustomerPhone))
        {
            var restaurantName = order.Restaurant.Name;
            var message = $"Your order has been confirmed! We'll have it ready for pickup on {order.PickupDate:dd/MM/yyyy} at {order.PickupTime:hh\\:mm}. Thank you!";

            try
            {
                await twilioSmsService.SendSmsAsync(order.CustomerPhone, restaurantName, message);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send SMS notification: {ex.Message}");
            }
        }

        if (status == OrderStatus.Ready && !string.IsNullOrEmpty(order.CustomerPhone))
        {
            var restaurantName = order.Restaurant.Name;
            var message = $"Your order is ready for pickup! Please come to the restaurant to pick it up. Thank you!";

            try
            {
                await twilioSmsService.SendSmsAsync(order.CustomerPhone, restaurantName, message);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send SMS notification: {ex.Message}");
            }
        }

        await context.SaveChangesAsync(cancellationToken);

        return new UpdateOrderStatusResult(
            order.Id,
            order.Status.ToString(),
            order.UpdatedAt.Value
        );
    }
}

