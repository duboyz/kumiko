using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.RestaurantMenu.CreateRestaurantMenu;

[Route("api/restaurant-menus")]
[Tags("RestaurantMenu")]
[Authorize]
public class CreateRestaurantMenuController(IMediator mediator) : BaseController(mediator)
{
    [HttpPost]
    public async Task<ActionResult<ApiResponse<CreateRestaurantMenuResult>>> CreateRestaurantMenu([FromBody] CreateRestaurantMenuCommand command)
    {
        var result = await Mediator.Send(command);
        return CreateResponse(result, ApiResponseStatusCode.Created, "Restaurant menu created successfully");
    }
}
