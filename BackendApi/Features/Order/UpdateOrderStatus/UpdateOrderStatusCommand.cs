using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Order.UpdateOrderStatus;

public record UpdateOrderStatusCommand(
    Guid OrderId,
    string Status
) : ICommand<UpdateOrderStatusResult>;

public record UpdateOrderStatusResult(
    Guid Id,
    string Status,
    DateTime UpdatedAt
);

