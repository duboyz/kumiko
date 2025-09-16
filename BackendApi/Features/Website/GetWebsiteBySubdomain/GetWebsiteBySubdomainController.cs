using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.Website.GetWebsiteBySubdomain;

[Route("api/website")]
[Tags("Website")]
public class GetWebsiteBySubdomainController(IMediator mediator) : BaseController(mediator)
{
    [HttpGet("by-subdomain/{subdomain}")]
    public async Task<ActionResult<ApiResponse<GetWebsiteBySubdomainResult>>> GetWebsiteBySubdomain(string subdomain)
    {
        var query = new GetWebsiteBySubdomainQuery(subdomain);
        var result = await Mediator.Send(query);
        return CreateResponse(result);
    }
}