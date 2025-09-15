using BackendApi.Models;
using BackendApi.Models.Address;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.AddressSearch.SearchBusiness;

[Route("api/search")]
[Tags("AddressSearch")]
[Authorize]
public class SearchBusinessController(IMediator mediator) : BaseController(mediator)
{
    [HttpPost("businesses")]
    public async Task<ActionResult<ApiResponse<SearchBusinessResult>>> SearchBusinesses([FromBody] RequestSearchAddress request)
    {
        var command = new SearchBusinessCommand(request);
        var result = await Mediator.Send(command);

        return CreateResponse(result, ApiResponseStatusCode.Success, "Business search completed successfully");
    }
}
