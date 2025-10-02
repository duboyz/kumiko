using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.WebsitePage.CreatePageFromTemplate;

[Route("api/website-pages")]
public class CreatePageFromTemplateController(IMediator mediator) : BaseController(mediator)
{
    [HttpPost("from-template")]
    public async Task<ActionResult<ApiResponse<CreatePageFromTemplateResult>>> CreatePageFromTemplate([FromBody] CreatePageFromTemplateCommand command)
    {
        var result = await Mediator.Send(command);
        return CreateResponse(result);
    }
}
