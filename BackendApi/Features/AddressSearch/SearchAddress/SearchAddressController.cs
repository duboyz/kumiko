using BackendApi.Models;
using BackendApi.Models.Address;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.AddressSearch.SearchAddress;

[Route("api/search")]
[Tags("AddressSearch")]

[Authorize]
public class SearchAddressController(IMediator mediator) : BaseController(mediator)
{
    [HttpPost("addresses")]
    public async Task<ActionResult<ApiResponse<SearchAddressResult>>> SearchAddresses([FromBody] RequestSearchAddress request)
    {
        var command = new SearchAddressCommand(request);
        var result = await Mediator.Send(command);

        return CreateResponse(result, ApiResponseStatusCode.Success, "Address search completed successfully");
    }
}
