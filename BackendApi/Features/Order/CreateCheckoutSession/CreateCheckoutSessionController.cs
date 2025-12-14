using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.Order.CreateCheckoutSession;

[Route("api/orders")]
[Tags("Orders")]
public class CreateCheckoutSessionController(IMediator mediator) : BaseController(mediator)
{
    [HttpPost("{orderId}/checkout-session")]
    public async Task<ActionResult<ApiResponse<CreateCheckoutSessionResult>>> CreateCheckoutSession([FromRoute] Guid orderId)
    {
        var command = new CreateCheckoutSessionCommand(orderId);
        var result = await Mediator.Send(command);

        return Ok(new ApiResponse<CreateCheckoutSessionResult>
        {
            Success = true,
            StatusCode = ApiResponseStatusCode.Success,
            Message = "Checkout session created successfully",
            Data = result
        });
    }
}


