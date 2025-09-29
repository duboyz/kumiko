using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.RestaurantMenu.DeleteRestaurantMenu;

[Route("api/restaurant-menus")]
[Tags("RestaurantMenu")]
[Authorize]
public class DeleteRestaurantMenuController(IMediator mediator) : BaseController(mediator)
{
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<DeleteRestaurantMenuResult>>> DeleteRestaurantMenu([FromRoute] Guid id)
    {
        var command = new DeleteRestaurantMenuCommand(id);
        var result = await Mediator.Send(command);
        return CreateResponse(result, ApiResponseStatusCode.Success, "Restaurant menu deleted successfully");
    }
}
