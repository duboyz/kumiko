using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.Allergen.GetAllergens;

[Route("api/allergens")]
[Tags("Allergen")]
[Authorize]
public class GetAllergensController(IMediator mediator) : BaseController(mediator)
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<GetAllergensResult>>> GetAllergens()
    {
        var query = new GetAllergensQuery();
        var result = await Mediator.Send(query);
        return CreateResponse(result, ApiResponseStatusCode.Success);
    }
}

