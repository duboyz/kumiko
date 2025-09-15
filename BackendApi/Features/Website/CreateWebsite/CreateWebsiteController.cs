using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.Website.CreateWebsite;

[Route("api/website/create")]
[Tags("Website")]
[Authorize]
public class CreateWebsiteController(IMediator mediator) : BaseController(mediator)
{
    [HttpPost]
    public async Task<ActionResult<ApiResponse<CreateWebsiteResult>>> CreateWebsite([FromBody] CreateWebsiteCommand command)
    {
        var result = await Mediator.Send(command);
        return CreateResponse(result, ApiResponseStatusCode.Success, "Website created successfully");
    }
}