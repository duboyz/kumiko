using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BackendApi.Features.Auth.Me;

[Route("api/auth")]
[Tags("Auth")]
public class GetCurrentUserController(IMediator mediator) : BaseController(mediator)
{
    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<GetCurrentUserResult>>> GetCurrentUser()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var parsedUserId))
        {
            return Unauthorized(new ApiResponse<GetCurrentUserResult>
            {
                Success = false,
                StatusCode = ApiResponseStatusCode.Unauthorized,
                Message = "User not authenticated",
                Data = default
            });
        }

        var query = new GetCurrentUserQuery(parsedUserId);
        var result = await Mediator.Send(query);

        return CreateResponse(result, ApiResponseStatusCode.Success, "User retrieved successfully");
    }
}