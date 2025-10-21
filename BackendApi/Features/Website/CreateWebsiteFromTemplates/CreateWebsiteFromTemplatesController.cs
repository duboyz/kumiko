using BackendApi.Models;
using BackendApi.Shared.Controllers;
using BackendApi.Shared.Results;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.Website.CreateWebsiteFromTemplates;

[ApiController]
[Route("api/websites")]
[Authorize]
public class CreateWebsiteFromTemplatesController(IMediator mediator) : BaseController(mediator)
{
    [HttpPost("create-from-templates")]
    public async Task<ActionResult<ApiResponse<CreateWebsiteFromTemplatesResult>>> CreateWebsiteFromTemplates(
        [FromBody] CreateWebsiteFromTemplatesCommand command)
    {
        var result = await Mediator.Send(command);
        return CreateResponse(result, ApiResponseStatusCode.Created, "Website created successfully from templates");
    }
}
