using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.Subscription.DebugStripePrices;

[Route("api/subscriptions")]
[Tags("Subscription")]
[Authorize]
public class DebugStripePricesController(IMediator mediator) : BaseController(mediator)
{
    [HttpGet("debug/stripe-prices")]
    public async Task<ActionResult<ApiResponse<DebugStripePricesResult>>> GetStripePrices()
    {
        var query = new DebugStripePricesQuery();
        var result = await Mediator.Send(query);

        return CreateResponse(result, ApiResponseStatusCode.Success, "Stripe prices retrieved");
    }
}
