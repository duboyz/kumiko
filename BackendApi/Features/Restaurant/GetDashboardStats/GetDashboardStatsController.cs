using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.Restaurant.GetDashboardStats;

[Route("api/restaurants")]
[Tags("Restaurant")]
[Authorize]
public class GetDashboardStatsController(IMediator mediator) : BaseController(mediator)
{
    [HttpGet("{restaurantId}/dashboard-stats")]
    public async Task<ActionResult<ApiResponse<DashboardStatsResult>>> GetDashboardStats(
        [FromRoute] Guid restaurantId,
        [FromQuery] int days = 30)
    {
        var query = new GetDashboardStatsQuery(restaurantId, days);
        var result = await Mediator.Send(query);
        return CreateResponse(result, ApiResponseStatusCode.Success);
    }
}

