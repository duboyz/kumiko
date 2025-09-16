using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.RestaurantMenu.GetRestaurantMenus;

[Route("api/restaurant-menus")]
[Tags("RestaurantMenu")]
[Authorize]
public class GetRestaurantMenusController(IMediator mediator) : BaseController(mediator)
{
    [HttpGet("restaurant/{restaurantId}")]
    public async Task<ActionResult<ApiResponse<GetRestaurantMenusResult>>> GetRestaurantMenus([FromRoute] Guid restaurantId)
    {
        var query = new GetRestaurantMenusQuery(restaurantId);
        var result = await Mediator.Send(query);
        return CreateResponse(result, ApiResponseStatusCode.Success);
    }
}
