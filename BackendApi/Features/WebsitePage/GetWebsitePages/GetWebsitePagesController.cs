using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.WebsitePage.GetWebsitePages;

[Route("api/page/list")]
[Tags("WebsitePage")]
[Authorize]
public class GetWebsitePagesController(IMediator mediator) : BaseController(mediator)
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<GetWebsitePagesResult>>> GetWebsitePages([FromQuery] Guid websiteId)
    {
        var query = new GetWebsitePagesQuery(websiteId);
        var result = await Mediator.Send(query);
        return CreateResponse(result, ApiResponseStatusCode.Success, "Pages retrieved successfully");
    }
}