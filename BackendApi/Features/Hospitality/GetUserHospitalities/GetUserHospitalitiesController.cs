using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.Hospitality.GetUserHospitalities;

[Route("api/hospitality/list")]
[Tags("Hospitality")]
[Authorize]
public class GetUserHospitalitiesController(IMediator mediator) : BaseController(mediator)
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<GetUserHospitalitiesResult>>> GetUserHospitalities()
    {
        var query = new GetUserHospitalitiesQuery();
        var result = await Mediator.Send(query);
        return CreateResponse(result, ApiResponseStatusCode.Success, "User hospitalities retrieved successfully");
    }
}