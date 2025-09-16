using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.RestaurantMenu.UpdateMenuItem;

[Route("api/menu-items")]
[Tags("MenuItem")]
[Authorize]
public class UpdateMenuItemController(IMediator mediator) : BaseController(mediator)
{
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<UpdateMenuItemResult>>> UpdateMenuItem([FromRoute] Guid id, [FromBody] UpdateMenuItemCommand command)
    {
        // Ensure the ID in the route matches the command
        if (id != command.Id)
        {
            return BadRequest("ID mismatch");
        }

        var result = await Mediator.Send(command);
        return CreateResponse(result, ApiResponseStatusCode.Success, "Menu item updated successfully");
    }
}
