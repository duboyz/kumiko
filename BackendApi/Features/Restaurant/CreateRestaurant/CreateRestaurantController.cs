using BackendApi.Models;
using BackendApi.Models.Restaurant;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.Restaurant.CreateRestaurant;

[Route("api/restaurants")]
[Tags("Restaurant")]
[Authorize]
public class CreateRestaurantController(IMediator mediator) : BaseController(mediator)
{
    [HttpPost]
    public async Task<ActionResult<ApiResponse<RestaurantBaseDto>>> CreateRestaurant([FromBody] CreateRestaurantCommand command)
    {
        var result = await Mediator.Send(command);
        return CreateResponse(result, ApiResponseStatusCode.Success, "Restaurant created successfully");
    }
}