using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.RestaurantMenu.DeleteMenuCategory;

[Route("api/menu-categories")]
[Tags("MenuCategory")]
[Authorize]
public class DeleteMenuCategoryController(IMediator mediator) : BaseController(mediator)
{
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<DeleteMenuCategoryResult>>> DeleteMenuCategory([FromRoute] Guid id)
    {
        var command = new DeleteMenuCategoryCommand(id);
        var result = await Mediator.Send(command);
        return CreateResponse(result, ApiResponseStatusCode.Success, "Menu category deleted successfully");
    }
}
