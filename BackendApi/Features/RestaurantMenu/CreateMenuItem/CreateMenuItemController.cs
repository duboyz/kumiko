using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.RestaurantMenu.CreateMenuItem;

[Route("api/menu-items")]
[Tags("MenuItem")]
[Authorize]
public class CreateMenuItemController(IMediator mediator) : BaseController(mediator)
{
    [HttpPost]
    public async Task<ActionResult<ApiResponse<CreateMenuItemResult>>> CreateMenuItem([FromBody] CreateMenuItemCommand command)
    {
        var result = await Mediator.Send(command);
        return CreateResponse(result, ApiResponseStatusCode.Created, "Menu item created successfully");
    }
}
