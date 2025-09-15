using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.Auth.Logout;

[Route("api/auth")]
[Tags("Auth")]
public class LogoutController(IMediator mediator) : BaseController(mediator)
{
    [HttpPost("logout")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<object>>> Logout()
    {
        var command = new LogoutCommand();
        var result = await Mediator.Send(command);

        return CreateResponse(ApiResponseStatusCode.Success, "Logout successful");
    }
}