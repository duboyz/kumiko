using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.WebsiteSection.DeleteSection;

[Route("api/website-sections")]
[Tags("WebsiteSection")]
[Authorize]
public class DeleteSectionController(IMediator mediator) : BaseController(mediator)
{
    [HttpDelete("{sectionId}")]
    public async Task<ActionResult<ApiResponse<DeleteSectionResult>>> DeleteSection(Guid sectionId)
    {
        var command = new DeleteSectionCommand(sectionId);
        var result = await Mediator.Send(command);
        return CreateResponse(result, ApiResponseStatusCode.Success, "Section deleted successfully");
    }
}