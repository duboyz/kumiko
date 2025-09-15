using BackendApi.Models;
using BackendApi.Models.Restaurant;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.Restaurant.GetRestaurantById;

[Route("api/restaurants")]
[Tags("Restaurant")]
public class GetRestaurantByIdController(IMediator mediator) : BaseController(mediator)
{
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<RestaurantBaseDto>>> GetById([FromRoute] Guid id)
    {
        var query = new GetRestaurantByIdQuery(id);
        var restaurant = await Mediator.Send(query);
        return CreateResponse(restaurant, ApiResponseStatusCode.Success, "Restaurant retrieved successfully");
    }
}