using BackendApi.Models;
using BackendApi.Models.Auth;
using BackendApi.Shared.Controllers;
using BackendApi.Shared.Results;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.Auth.RefreshToken;

[Route("/api/auth")]
public class RefreshTokenController : BaseController
{
    public RefreshTokenController(IMediator mediator) : base(mediator) { }

    [HttpPost("refresh")]
    public async Task<ActionResult<ApiResponse<RefreshTokenResult>>> RefreshToken([FromBody] RefreshTokenRequest? request = null)
    {
        // Get refresh token from cookie if not provided in body (for web clients)
        string? refreshToken = request?.RefreshToken;
        ClientType clientType = request?.ClientType ?? ClientType.Web;

        if (string.IsNullOrEmpty(refreshToken) && clientType == ClientType.Web)
        {
            refreshToken = Request.Cookies["RefreshToken"];
        }

        if (string.IsNullOrEmpty(refreshToken))
        {
            throw new ArgumentException("Refresh token is required");
        }

        var command = new RefreshTokenCommand(refreshToken, clientType);
        var result = await Mediator.Send(command);
        return CreateResponse(result, ApiResponseStatusCode.Success, "Token refreshed successfully");
    }
}

public record RefreshTokenRequest(
    string? RefreshToken,
    ClientType? ClientType = ClientType.Web
);