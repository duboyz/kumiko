using BackendApi.Controllers;
using BackendApi.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.Restaurant.StripeConnect.RefreshConnectStatus;

[Route("api/restaurant")]
[Tags("StripeConnect")]
public class RefreshConnectStatusController : BaseAuthenticatedController
{
    private readonly IMediator _mediator;

    public RefreshConnectStatusController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("{restaurantId}/stripe-connect/refresh-status")]
    public async Task<ActionResult<ApiResponse<RefreshConnectStatusResult>>> RefreshConnectStatus([FromRoute] Guid restaurantId)
    {
        var command = new RefreshConnectStatusCommand(restaurantId);
        var result = await _mediator.Send(command);

        return Ok(new ApiResponse<RefreshConnectStatusResult>
        {
            Success = result.Success,
            StatusCode = result.Success ? ApiResponseStatusCode.Success : ApiResponseStatusCode.BadRequest,
            Message = result.Success ? "Status refreshed successfully" : result.ErrorMessage ?? "Failed to refresh status",
            Data = result
        });
    }
}

