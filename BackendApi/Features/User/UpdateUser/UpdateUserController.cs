using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BackendApi.Features.User.UpdateUser;

[Route("api/users")]
[Tags("User")]
[Authorize]
public class UpdateUserController(IMediator mediator) : BaseController(mediator)
{
    [HttpPut("profile")]
    public async Task<ActionResult<ApiResponse<object>>> UpdateProfile([FromBody] UpdateUserRequest request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new ApiResponse<object>
            {
                Success = false,
                StatusCode = ApiResponseStatusCode.Unauthorized,
                Message = "User not authenticated",
                Data = null
            });
        }

        var command = new UpdateUserCommand(userId, request.FirstName, request.LastName);
        await Mediator.Send(command);

        return CreateResponse(ApiResponseStatusCode.Success, "User profile updated successfully");
    }
}

public record UpdateUserRequest(string? FirstName, string? LastName);
