using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.WebsitePage.CreateWebsitePage;

[Route("api/page/create")]
[Tags("WebsitePage")]
[Authorize]
public class CreateWebsitePageController(IMediator mediator) : BaseController(mediator)
{
    [HttpPost]
    public async Task<ActionResult<ApiResponse<CreateWebsitePageResult>>> CreateWebsitePage([FromBody] CreateWebsitePageCommand command)
    {
        var result = await Mediator.Send(command);
        return CreateResponse(result, ApiResponseStatusCode.Success, "Page created successfully");
    }
}