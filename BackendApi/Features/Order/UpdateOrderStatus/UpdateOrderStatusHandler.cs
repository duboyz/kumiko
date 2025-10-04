using BackendApi.Data;
using BackendApi.Entities;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.Order.UpdateOrderStatus;

public class UpdateOrderStatusHandler(ApplicationDbContext context) : ICommandHandler<UpdateOrderStatusCommand, UpdateOrderStatusResult>
{
    public async Task<UpdateOrderStatusResult> Handle(UpdateOrderStatusCommand request, CancellationToken cancellationToken)
    {
        var order = await context.Orders
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

        await context.SaveChangesAsync(cancellationToken);

        return new UpdateOrderStatusResult(
            order.Id,
            order.Status.ToString(),
            order.UpdatedAt.Value
        );
    }
}

