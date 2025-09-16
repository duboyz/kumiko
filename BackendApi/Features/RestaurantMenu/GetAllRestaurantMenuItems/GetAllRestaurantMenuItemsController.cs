using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.RestaurantMenu.GetAllRestaurantMenuItems;

[Route("api/menu-items")]
[Tags("MenuItem")]
[Authorize]
public class GetAllRestaurantMenuItemsController(IMediator mediator) : BaseController(mediator)
{
    [HttpGet("restaurant/{restaurantId}")]
    public async Task<ActionResult<ApiResponse<GetAllRestaurantMenuItemsResult>>> GetAllRestaurantMenuItems([FromRoute] Guid restaurantId)
    {
        var query = new GetAllRestaurantMenuItemsQuery(restaurantId);
        var result = await Mediator.Send(query);
        return CreateResponse(result, ApiResponseStatusCode.Success);
    }
}
