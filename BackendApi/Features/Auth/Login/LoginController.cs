using BackendApi.Models;
using BackendApi.Models.Auth;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.Auth.Login;

[Route("api/auth")]
[Tags("Auth")]
public class LoginController(IMediator mediator) : BaseController(mediator)
{
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<LoginResult>>> Login([FromBody] LoginRequest request)
    {
        var command = new LoginCommand(
            request.Email,
            request.Password,
            request.ClientType
        );

        var result = await Mediator.Send(command);
        return CreateResponse(result, ApiResponseStatusCode.Success, "Login successful");
    }
}

public record LoginRequest(string Email, string Password, ClientType ClientType);