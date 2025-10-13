using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.Subscription.CreateCheckoutSession;

[Route("api/subscriptions")]
[Tags("Subscription")]
[Authorize]
public class CreateCheckoutSessionController(IMediator mediator) : BaseController(mediator)
{
    [HttpPost("checkout")]
    public async Task<ActionResult<ApiResponse<CreateCheckoutSessionResult>>> CreateCheckout([FromBody] CreateCheckoutSessionCommand command)
    {
        var result = await Mediator.Send(command);
        return CreateResponse(result, ApiResponseStatusCode.Success, "Checkout session created successfully");
    }
}
