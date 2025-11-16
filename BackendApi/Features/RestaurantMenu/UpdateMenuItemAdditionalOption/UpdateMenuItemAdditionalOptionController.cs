using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.RestaurantMenu.UpdateMenuItemAdditionalOption;

[Authorize]
[ApiController]
[Route("api/menu-items/additional-options/{id:guid}")]
public class UpdateMenuItemAdditionalOptionController(IMediator mediator) : BaseController(mediator)
{
    [HttpPut]
    public async Task<ActionResult<ApiResponse<UpdateMenuItemAdditionalOptionResult>>> UpdateAdditionalOption(
        Guid id,
        [FromBody] UpdateMenuItemAdditionalOptionCommand command)
    {
        // Ensure the id in the route matches the command
        var updatedCommand = command with { Id = id };

        var result = await Mediator.Send(updatedCommand);
        return CreateResponse(result, ApiResponseStatusCode.Success, "Additional option updated successfully");
    }
}

