using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.RestaurantMenu.ParseMenuImage;

[Route("api/restaurant-menu")]
[Tags("RestaurantMenu")]
[Authorize]
public class ParseMenuImageController(IMediator mediator) : BaseController(mediator)
{
    [HttpPost("parse-image")]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<ApiResponse<ParseMenuImageResult>>> ParseMenuImage([FromForm] ParseMenuImageCommand command)
    {
        var result = await Mediator.Send(command);
        return CreateResponse(result, ApiResponseStatusCode.Created, "Menu parsed and created successfully");
    }
}
