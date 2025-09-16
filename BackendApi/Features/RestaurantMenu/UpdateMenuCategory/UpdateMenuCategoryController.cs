using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.RestaurantMenu.UpdateMenuCategory;

[Route("api/menu-categories")]
[Tags("MenuCategory")]
[Authorize]
public class UpdateMenuCategoryController(IMediator mediator) : BaseController(mediator)
{
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<UpdateMenuCategoryResult>>> UpdateMenuCategory([FromRoute] Guid id, [FromBody] UpdateMenuCategoryCommand command)
    {
        // Ensure the ID in the route matches the command
        if (id != command.Id)
        {
            return BadRequest("ID mismatch");
        }

        var result = await Mediator.Send(command);
        return CreateResponse(result, ApiResponseStatusCode.Success, "Menu category updated successfully");
    }
}
