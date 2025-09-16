using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.RestaurantMenu.AddMenuItemToCategory;

[Route("api/menu-category-items")]
[Tags("MenuCategoryItem")]
[Authorize]
public class AddMenuItemToCategoryController(IMediator mediator) : BaseController(mediator)
{
    [HttpPost]
    public async Task<ActionResult<ApiResponse<AddMenuItemToCategoryResult>>> AddMenuItemToCategory([FromBody] AddMenuItemToCategoryCommand command)
    {
        var result = await Mediator.Send(command);
        return CreateResponse(result, ApiResponseStatusCode.Created, "Menu item added to category successfully");
    }
}
