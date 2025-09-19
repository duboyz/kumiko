using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.RestaurantMenu.DeleteMenuItem;

[Route("api/menu-items")]
[Tags("MenuItem")]
[Authorize]
public class DeleteRestaurantMenuItemsController(IMediator mediator) : BaseController(mediator)
{
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<DeleteMenuItemResult>>> DeleteRestaurantMenuItems([FromRoute] Guid id)
    {
        var command = new DeleteMenuItemCommand(id);
        var result = await Mediator.Send(command);
        return CreateResponse(result, ApiResponseStatusCode.Success, "Menu item deleted successfully");
    }
}
