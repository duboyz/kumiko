using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.RestaurantMenu.GetRestaurantMenuItems;

[Route("api/menu-items")]
[Tags("MenuItem")]
[Authorize]
public class GetRestaurantMenuItemsController(IMediator mediator) : BaseController(mediator)
{
    [HttpGet("restaurant-menu/{restaurantMenuId}")]
    public async Task<ActionResult<ApiResponse<GetRestaurantMenuItemsResult>>> GetRestaurantMenuItems([FromRoute] Guid restaurantMenuId)
    {
        var query = new GetRestaurantMenuItemsQuery(restaurantMenuId);
        var result = await Mediator.Send(query);
        return CreateResponse(result, ApiResponseStatusCode.Success);
    }
}
