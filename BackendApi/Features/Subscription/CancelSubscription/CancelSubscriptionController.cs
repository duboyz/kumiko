using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.Subscription.CancelSubscription;

[Route("api/subscriptions")]
[Tags("Subscription")]
[Authorize]
public class CancelSubscriptionController(IMediator mediator) : BaseController(mediator)
{
    [HttpPost("cancel")]
    public async Task<ActionResult<ApiResponse<CancelSubscriptionResult>>> Cancel()
    {
        var command = new CancelSubscriptionCommand();
        var result = await Mediator.Send(command);

        if (!result.Success)
        {
            return CreateResponse(result, ApiResponseStatusCode.BadRequest, result.Message);
        }

        return CreateResponse(result, ApiResponseStatusCode.Success, result.Message);
    }
}
