using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.Restaurant.StripeConnect.GetPublicConnectStatus;

[Route("api/public/restaurant")]
[AllowAnonymous]
[Tags("StripeConnect")]
public class GetPublicConnectStatusController(IMediator mediator) : BaseController(mediator)
{
    [HttpGet("{restaurantId}/stripe-connect/status")]
    public async Task<ActionResult<ApiResponse<GetPublicConnectStatusResult>>> GetStatus([FromRoute] Guid restaurantId)
    {
        var query = new GetPublicConnectStatusQuery(restaurantId);
        var result = await Mediator.Send(query);
        return CreateResponse(result, ApiResponseStatusCode.Success, "Connect status retrieved successfully");
    }
}


