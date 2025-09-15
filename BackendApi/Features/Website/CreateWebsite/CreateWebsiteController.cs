using BackendApi.Shared;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.Website.CreateWebsite;

[ApiController]
[Route("api/website")]
[Authorize]
public class CreateWebsiteController(IMediator mediator) : BaseController
{
    [HttpPost]
    public async Task<IActionResult> CreateWebsite([FromBody] CreateWebsiteCommand command)
    {
        var result = await mediator.Send(command);
        return CreateResponse(result);
    }
}