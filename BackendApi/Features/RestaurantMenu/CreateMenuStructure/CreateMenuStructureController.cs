using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.RestaurantMenu.CreateMenuStructure;

[Route("api/restaurant-menu")]
[Tags("RestaurantMenu")]
[Authorize]
public class CreateMenuStructureController(IMediator mediator) : BaseController(mediator)
{
    [HttpPost("create-structure")]
    public async Task<ActionResult<ApiResponse<CreateMenuStructureResult>>> CreateMenuStructure([FromBody] CreateMenuStructureCommand command)
    {
        var result = await Mediator.Send(command);
        return CreateResponse(result, ApiResponseStatusCode.Created, "Menu structure created successfully");
    }
}
