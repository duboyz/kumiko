using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.WebsiteSection.CreateTextSection;

[Route("api/section/text")]
[Tags("WebsiteSection")]
[Authorize]
public class CreateTextSectionController(IMediator mediator) : BaseController(mediator)
{
    [HttpPost]
    public async Task<ActionResult<ApiResponse<CreateTextSectionResult>>> CreateTextSection([FromBody] CreateTextSectionCommand command)
    {
        var result = await Mediator.Send(command);
        return CreateResponse(result, ApiResponseStatusCode.Success, "Text section created successfully");
    }
}