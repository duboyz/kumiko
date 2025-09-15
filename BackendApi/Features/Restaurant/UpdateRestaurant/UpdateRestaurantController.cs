using BackendApi.Models;
using BackendApi.Models.Restaurant;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.Restaurant.UpdateRestaurant;

[Route("api/restaurants")]
[Tags("Restaurant")]
public class UpdateRestaurantController(IMediator mediator) : BaseController(mediator)
{
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<RestaurantBaseDto>>> UpdateRestaurant([FromRoute] Guid id, [FromBody] UpdateRestaurantCommand command)
    {
        var result = await Mediator.Send(command);
        return CreateResponse(result, ApiResponseStatusCode.Success, "Restaurant updated successfully");
    }
}