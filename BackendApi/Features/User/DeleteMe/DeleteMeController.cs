using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.User.DeleteMe;

[Route("api/users")]
[Tags("User")]
[Authorize]
public class DeleteMeController(IMediator mediator) : BaseController(mediator)
{
    [HttpDelete("delete-me")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteMe([FromBody] DeleteMeCommand command)
    {
        await Mediator.Send(command);
        return CreateResponse(ApiResponseStatusCode.Success, "User deleted successfully");
    }
}