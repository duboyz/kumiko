using BackendApi.Models;
using BackendApi.Models.Auth;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.Auth.Register;

[Route("api/auth")]
[Tags("Auth")]
public class RegisterController(IMediator mediator) : BaseController(mediator)
{
    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<RegisterResult>>> Register([FromBody] RegisterRequest request)
    {
        var command = new RegisterCommand(
            request.Email,
            request.Password,
            request.FirstName,
            request.LastName,
            request.ClientType
        );

        var result = await Mediator.Send(command);
        return CreateResponse(result, ApiResponseStatusCode.Created, "Registration successful");
    }
}

public record RegisterRequest(string Email, string Password, string? FirstName, string? LastName, ClientType ClientType);