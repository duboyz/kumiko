using BackendApi.Controllers;
using BackendApi.Models;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.Order.GetCustomerOrders;

[Route("api/orders")]
[Tags("Order")]
public class GetCustomerOrdersController : BaseAuthenticatedController
{
    private readonly IMediator _mediator;

    public GetCustomerOrdersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("my-orders")]
    public async Task<ActionResult<ApiResponse<List<CustomerOrderDto>>>> GetMyOrders()
    {
        var customerId = GetUserId();
        var query = new GetCustomerOrdersQuery(customerId);
        var result = await _mediator.Send(query);

        return Ok(new ApiResponse<List<CustomerOrderDto>>
        {
            Success = true,
            StatusCode = ApiResponseStatusCode.Success,
            Message = "Orders retrieved successfully",
            Data = result
        });
    }
}

