using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.RestaurantMenu.UpdateTitleAndDescription;

[Route("api/restaurant-menus")]
[Tags("RestaurantMenu")]
[Authorize]
public class UpdateRestaurantMenuController(IMediator mediator) : BaseController(mediator)
{
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<UpdateRestaurantMenuResult>>> UpdateRestaurantMenu([FromRoute] Guid id, [FromBody] UpdateRestaurantMenuCommand command)
    {
        // Ensure the ID in the route matches the command
        if (id != command.Id)
        {
            return BadRequest("ID mismatch");
        }

        var result = await Mediator.Send(command);
        return CreateResponse(result, ApiResponseStatusCode.Success, "Restaurant menu updated successfully");
    }
}
