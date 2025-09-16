using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.Website.UpdateWebsite;

[Route("api/website")]
[Tags("Website")]
[Authorize]
public class UpdateWebsiteController(IMediator mediator) : BaseController(mediator)
{
    [HttpPut("{websiteId}")]
    public async Task<ActionResult<ApiResponse<UpdateWebsiteResult>>> UpdateWebsite(Guid websiteId, [FromBody] UpdateWebsiteCommand command)
    {
        // Ensure the websiteId matches the command
        var updatedCommand = command with { WebsiteId = websiteId };
        var result = await Mediator.Send(updatedCommand);
        return CreateResponse(result, ApiResponseStatusCode.Success, "Website updated successfully");
    }
}