using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.WebsiteSection.ReorderSections;

[Route("api/website-sections")]
[Tags("WebsiteSection")]
[Authorize]
public class ReorderSectionsController(IMediator mediator) : BaseController(mediator)
{
    [HttpPost("reorder")]
    public async Task<ActionResult<ApiResponse<ReorderSectionsResult>>> ReorderSections(
        [FromBody] ReorderSectionsCommand command)
    {
        var result = await Mediator.Send(command);
        return CreateResponse(result, ApiResponseStatusCode.Success, "Sections reordered successfully");
    }
}
