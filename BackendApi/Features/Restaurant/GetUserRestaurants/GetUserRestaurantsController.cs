using BackendApi.Entities;
using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.Restaurant.GetUserRestaurants;

[Route("api/restaurants")]
[Tags("Restaurant")]
[Authorize]
public class GetUserRestaurantsController(IMediator mediator) : BaseController(mediator)
{
    [HttpGet("user")]
    public async Task<ActionResult<ApiResponse<GetUserRestaurantsResult>>> GetUserRestaurants([FromQuery] List<UserRole>? roles = null)
    {
        var query = new GetUserRestaurantsQuery(roles);
        var result = await Mediator.Send(query);
        return CreateResponse(result, ApiResponseStatusCode.Success, "User restaurants retrieved successfully");
    }
}