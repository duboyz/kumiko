using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.WebsiteSection.CreateTextAndImageSection;

[Route("api/section/text-and-image")]
[Tags("WebsiteSection")]
[Authorize]
public class CreateTextAndImageSectionController(IMediator mediator) : BaseController(mediator)
{
    [HttpPost]
    public async Task<ActionResult<ApiResponse<CreateTextAndImageSectionResult>>> CreateTextAndImageSection([FromBody] CreateTextAndImageSectionCommand command)
    {
        var result = await Mediator.Send(command);
        return CreateResponse(result, ApiResponseStatusCode.Success, "Text and image section created successfully");
    }
}
