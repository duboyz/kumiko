using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.Order.GetRestaurantOrders;

[Route("api/orders")]
[Tags("Order")]
[Authorize]
public class GetRestaurantOrdersController(IMediator mediator) : BaseController(mediator)
{
    [HttpGet("restaurant/{restaurantId}")]
    public async Task<ActionResult<ApiResponse<GetRestaurantOrdersResult>>> GetRestaurantOrders([FromRoute] Guid restaurantId)
    {
        var query = new GetRestaurantOrdersQuery(restaurantId);
        var result = await Mediator.Send(query);
        return CreateResponse(result, ApiResponseStatusCode.Success);
    }
}

