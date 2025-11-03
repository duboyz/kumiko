using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.Restaurant.RegisterDeviceToken;

[Route("api/restaurants")]
[Tags("Restaurant")]
[Authorize]
public class RegisterDeviceTokenController(IMediator mediator) : BaseController(mediator)
{
    [HttpPost("{restaurantId}/register-device")]
    public async Task<ActionResult<ApiResponse<RegisterDeviceTokenResult>>> RegisterDevice(
        [FromRoute] Guid restaurantId,
        [FromBody] RegisterDeviceTokenRequest request)
    {
        var command = new RegisterDeviceTokenCommand(
            restaurantId,
            request.ExpoPushToken,
            request.DeviceType
        );

        var result = await Mediator.Send(command);
        return CreateResponse(result, ApiResponseStatusCode.Success, "Device registered successfully");
    }
}

public record RegisterDeviceTokenRequest(
    string ExpoPushToken,
    string DeviceType
);
