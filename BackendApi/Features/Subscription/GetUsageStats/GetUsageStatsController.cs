using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.Subscription.GetUsageStats;

[Route("api/subscriptions")]
[Tags("Subscription")]
[Authorize]
public class GetUsageStatsController(IMediator mediator) : BaseController(mediator)
{
    [HttpGet("usage")]
    public async Task<ActionResult<ApiResponse<GetUsageStatsResult>>> GetUsageStats()
    {
        var query = new GetUsageStatsQuery();
        var result = await Mediator.Send(query);
        return CreateResponse(result, ApiResponseStatusCode.Success, "Usage statistics retrieved successfully");
    }
}