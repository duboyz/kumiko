using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.Order.GetOrders;

[Route("api/orders")]
[Tags("Order")]
[Authorize]
public class GetOrdersController(IMediator mediator) : BaseController(mediator)
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<GetOrdersResult>>> GetOrders()
    {
        var query = new GetOrdersQuery();
        var result = await Mediator.Send(query);
        return CreateResponse(result, ApiResponseStatusCode.Success);
    }
}
