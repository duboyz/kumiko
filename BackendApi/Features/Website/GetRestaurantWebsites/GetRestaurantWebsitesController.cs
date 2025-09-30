using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.Website.GetRestaurantWebsites;

[Route("api/website/list")]
[Tags("Website")]
[Authorize]
public class GetRestaurantWebsitesController(IMediator mediator) : BaseController(mediator)
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<WebsiteDto>>>> GetRestaurantWebsites(
        [FromQuery] Guid? entityId = null,
        [FromQuery] string? entityType = null)
    {
        var query = new GetRestaurantWebsitesQuery(entityId, entityType);
        var result = await Mediator.Send(query);
        return CreateResponse(result, ApiResponseStatusCode.Success, "Restaurant websites retrieved successfully");
    }
}