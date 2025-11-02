using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.Auth.ForgotPassword;

[Route("api/auth")]
[Tags("Auth")]
public class ForgotPasswordController(IMediator mediator) : BaseController(mediator)
{
    [HttpPost("forgot-password")]
    public async Task<ActionResult<ApiResponse<ForgotPasswordResult>>> ForgotPassword(
        [FromBody] ForgotPasswordCommand command)
    {
        var result = await Mediator.Send(command);
        return CreateResponse(result, ApiResponseStatusCode.Success);
    }
}

