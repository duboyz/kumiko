using BackendApi.Entities;
using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.Restaurant.UpdateRestaurantSettings;

[Route("api/restaurant")]
[Tags("Restaurant")]
[Authorize]
public class UpdateRestaurantSettingsController(IMediator mediator) : BaseController(mediator)
{
    [HttpPut("{id}/settings")]
    public async Task<ActionResult<ApiResponse<object>>> UpdateSettings(Guid id, [FromBody] UpdateRestaurantSettingsRequest request)
    {
        var command = new UpdateRestaurantSettingsCommand(id, request.Currency);
        await Mediator.Send(command);

        return CreateResponse(ApiResponseStatusCode.Success, "Restaurant settings updated successfully");
    }
}

public record UpdateRestaurantSettingsRequest(Currency Currency);