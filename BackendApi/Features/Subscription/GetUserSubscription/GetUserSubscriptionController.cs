using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.Subscription.GetUserSubscription;

[Route("api/subscriptions")]
[Tags("Subscription")]
[Authorize]
public class GetUserSubscriptionController(IMediator mediator) : BaseController(mediator)
{
    [HttpGet("me")]
    public async Task<ActionResult<ApiResponse<GetUserSubscriptionResult>>> GetMySubscription()
    {
        var query = new GetUserSubscriptionQuery();
        var result = await Mediator.Send(query);
        return CreateResponse(result, ApiResponseStatusCode.Success, "User subscription retrieved successfully");
    }
}
