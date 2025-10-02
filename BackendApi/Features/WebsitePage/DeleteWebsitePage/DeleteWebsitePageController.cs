using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.WebsitePage.DeleteWebsitePage;

[Route("api/page")]
[Tags("WebsitePage")]
[Authorize]
public class DeleteWebsitePageController(IMediator mediator) : BaseController(mediator)
{
    [HttpDelete("{pageId}")]
    public async Task<ActionResult<ApiResponse<DeleteWebsitePageResult>>> DeleteWebsitePage(Guid pageId)
    {
        var command = new DeleteWebsitePageCommand(pageId);
        var result = await Mediator.Send(command);
        return CreateResponse(result, ApiResponseStatusCode.Success, "Page deleted successfully");
    }
}
