using BackendApi.Controllers;
using BackendApi.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.Restaurant.StripeConnect.GetConnectStatus;

[Route("api/restaurant")]
[Tags("StripeConnect")]
public class GetConnectStatusController : BaseAuthenticatedController
{
    private readonly IMediator _mediator;

    public GetConnectStatusController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("{restaurantId}/stripe-connect/status")]
    public async Task<ActionResult<ApiResponse<GetConnectStatusResult>>> GetConnectStatus([FromRoute] Guid restaurantId)
    {
        var query = new GetConnectStatusQuery(restaurantId);
        var result = await _mediator.Send(query);

        return Ok(new ApiResponse<GetConnectStatusResult>
        {
            Success = true,
            StatusCode = ApiResponseStatusCode.Success,
            Message = "Connect status retrieved successfully",
            Data = result
        });
    }
}

