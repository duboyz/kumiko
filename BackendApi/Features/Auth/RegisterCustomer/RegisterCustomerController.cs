using BackendApi.Models;
using BackendApi.Models.Auth;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.Auth.RegisterCustomer;

[Route("api/auth")]
[Tags("Auth")]
public class RegisterCustomerController(IMediator mediator) : BaseController(mediator)
{
    [HttpPost("register-customer")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<RegisterCustomerResult>>> RegisterCustomer([FromBody] RegisterCustomerRequest request)
    {
        var command = new RegisterCustomerCommand(
            request.Email,
            request.Password,
            request.FirstName,
            request.LastName,
            request.PhoneNumber,
            request.ClientType
        );

        var result = await Mediator.Send(command);
        return CreateResponse(result, ApiResponseStatusCode.Success, "Customer registration successful");
    }
}

public record RegisterCustomerRequest(
    string Email,
    string Password,
    string FirstName,
    string LastName,
    string? PhoneNumber,
    ClientType ClientType
);

