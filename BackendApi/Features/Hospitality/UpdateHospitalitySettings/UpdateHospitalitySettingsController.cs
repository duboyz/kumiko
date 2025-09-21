using BackendApi.Entities;
using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.Hospitality.UpdateHospitalitySettings;

[Route("api/hospitality")]
[Tags("Hospitality")]
[Authorize]
public class UpdateHospitalitySettingsController(IMediator mediator) : BaseController(mediator)
{
    [HttpPut("{id}/settings")]
    public async Task<ActionResult<ApiResponse<object>>> UpdateSettings(Guid id, [FromBody] UpdateHospitalitySettingsRequest request)
    {
        var command = new UpdateHospitalitySettingsCommand(id, request.Currency);
        await Mediator.Send(command);

        return CreateResponse(ApiResponseStatusCode.Success, "Hospitality settings updated successfully");
    }
}

public record UpdateHospitalitySettingsRequest(Currency Currency);