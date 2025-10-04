using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.Order.UpdateOrderStatus;

[Route("api/orders")]
[Tags("Order")]
[Authorize]
public class UpdateOrderStatusController(IMediator mediator) : BaseController(mediator)
{
    [HttpPatch("{orderId}/status")]
    public async Task<ActionResult<ApiResponse<UpdateOrderStatusResult>>> UpdateOrderStatus(
        [FromRoute] Guid orderId,
        [FromBody] UpdateOrderStatusRequest request)
    {
        var command = new UpdateOrderStatusCommand(orderId, request.Status);
        var result = await Mediator.Send(command);
        return CreateResponse(result, ApiResponseStatusCode.Success, "Order status updated successfully");
    }
}

public record UpdateOrderStatusRequest(string Status);

