using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.RestaurantMenu.CreateMenuCategory;

[Route("api/menu-categories")]
[Tags("MenuCategory")]
[Authorize]
public class CreateMenuCategoryController(IMediator mediator) : BaseController(mediator)
{
    [HttpPost]
    public async Task<ActionResult<ApiResponse<CreateMenuCategoryResult>>> CreateMenuCategory([FromBody] CreateMenuCategoryCommand command)
    {
        var result = await Mediator.Send(command);
        return CreateResponse(result, ApiResponseStatusCode.Created, "Menu category created successfully");
    }
}
