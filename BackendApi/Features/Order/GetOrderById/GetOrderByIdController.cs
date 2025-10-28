using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.Order.GetOrderById;

[Route("api/orders")]
[Tags("Order")]
[AllowAnonymous]
public class GetOrderByIdController(IMediator mediator) : BaseController(mediator)
{
    [HttpGet("{orderId}/status")]
    public async Task<ActionResult<ApiResponse<GetOrderByIdResult>>> GetOrderById([FromRoute] Guid orderId)
    {
        var query = new GetOrderByIdQuery(orderId);
        var result = await Mediator.Send(query);
        return CreateResponse(result, ApiResponseStatusCode.Success);
    }
}
