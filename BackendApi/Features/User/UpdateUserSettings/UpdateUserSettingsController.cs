using BackendApi.Entities;
using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BackendApi.Features.User.UpdateUserSettings;

[Route("api/users")]
[Tags("User")]
[Authorize]
public class UpdateUserSettingsController(IMediator mediator) : BaseController(mediator)
{
    [HttpPut("settings")]
    public async Task<ActionResult<ApiResponse<object>>> UpdateSettings([FromBody] UpdateUserSettingsRequest request)
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

        var command = new UpdateUserSettingsCommand(userId, request.PreferredLanguage);
        await Mediator.Send(command);

        return CreateResponse(ApiResponseStatusCode.Success, "User settings updated successfully");
    }
}

public record UpdateUserSettingsRequest(Language PreferredLanguage);