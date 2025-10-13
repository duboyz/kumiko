using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.Subscription.GetSubscriptionPlans;

[Route("api/subscriptions")]
[Tags("Subscription")]
public class GetSubscriptionPlansController(IMediator mediator) : BaseController(mediator)
{
    [HttpGet("plans")]
    public async Task<ActionResult<ApiResponse<GetSubscriptionPlansResult>>> GetPlans()
    {
        var query = new GetSubscriptionPlansQuery();
        var result = await Mediator.Send(query);
        return CreateResponse(result, ApiResponseStatusCode.Success, "Subscription plans retrieved successfully");
    }
}
