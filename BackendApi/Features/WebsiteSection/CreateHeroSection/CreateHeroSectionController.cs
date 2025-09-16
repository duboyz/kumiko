using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.WebsiteSection.CreateHeroSection;

[Route("api/section/hero")]
[Tags("WebsiteSection")]
[Authorize]
public class CreateHeroSectionController(IMediator mediator) : BaseController(mediator)
{
    [HttpPost]
    public async Task<ActionResult<ApiResponse<CreateHeroSectionResult>>> CreateHeroSection([FromBody] CreateHeroSectionCommand command)
    {
        var result = await Mediator.Send(command);
        return CreateResponse(result, ApiResponseStatusCode.Success, "Hero section created successfully");
    }
}