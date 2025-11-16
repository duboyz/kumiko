using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.RestaurantMenu.AddMenuItemAdditionalOption;

[Authorize]
[ApiController]
[Route("api/menu-items/{menuItemId:guid}/additional-options")]
public class AddMenuItemAdditionalOptionController(IMediator mediator) : BaseController(mediator)
{
    [HttpPost]
    public async Task<ActionResult<ApiResponse<AddMenuItemAdditionalOptionResult>>> AddAdditionalOption(
        Guid menuItemId,
        [FromBody] AddMenuItemAdditionalOptionCommand command)
    {
        // Ensure the menuItemId in the route matches the command
        var updatedCommand = command with { MenuItemId = menuItemId };

        var result = await Mediator.Send(updatedCommand);
        return CreateResponse(result, ApiResponseStatusCode.Created, "Additional option added successfully");
    }
}

