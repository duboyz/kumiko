using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.RestaurantMenu.RemoveMenuItemFromCategory;

[Route("api/menu-category-items")]
[Tags("MenuCategoryItem")]
[Authorize]
public class RemoveMenuItemFromCategoryController(IMediator mediator) : BaseController(mediator)
{
    [HttpDelete("{categoryItemId}")]
    public async Task<ActionResult<ApiResponse<RemoveMenuItemFromCategoryResult>>> RemoveMenuItemFromCategory([FromRoute] Guid categoryItemId)
    {
        var command = new RemoveMenuItemFromCategoryCommand(categoryItemId);
        var result = await Mediator.Send(command);
        return CreateResponse(result, ApiResponseStatusCode.Success, "Menu item removed from category successfully");
    }
}
