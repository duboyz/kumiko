using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.Hospitality.CreateHospitality;

[Route("api/hospitality/create")]
[Tags("Hospitality")]
[Authorize]
public class CreateHospitalityController(IMediator mediator) : BaseController(mediator)
{
    [HttpPost]
    public async Task<ActionResult<ApiResponse<CreateHospitalityResult>>> CreateHospitality([FromBody] CreateHospitalityCommand command)
    {
        var result = await Mediator.Send(command);
        return CreateResponse(result, ApiResponseStatusCode.Success, "Hospitality created successfully");
    }
}