using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.RestaurantMenu.DeleteMenuItemAdditionalOption;

[Authorize]
[ApiController]
[Route("api/menu-items/additional-options/{id:guid}")]
public class DeleteMenuItemAdditionalOptionController(IMediator mediator) : BaseController(mediator)
{
    [HttpDelete]
    public async Task<ActionResult<ApiResponse<DeleteMenuItemAdditionalOptionResult>>> DeleteAdditionalOption(
        Guid id)
    {
        var command = new DeleteMenuItemAdditionalOptionCommand(id);
        var result = await Mediator.Send(command);
        return CreateResponse(result, ApiResponseStatusCode.Success, "Additional option deleted successfully");
    }
}

