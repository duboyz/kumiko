using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.Subscription.UpdateSubscriptionPlan;

[Route("api/subscriptions")]
[Tags("Subscription")]
[Authorize] // TODO: Add admin-only authorization in production
public class UpdateSubscriptionPlanController(IMediator mediator) : BaseController(mediator)
{
    [HttpPut("plans/{planId}/stripe-prices")]
    public async Task<ActionResult<ApiResponse<UpdateSubscriptionPlanResult>>> UpdateStripePrices(
        Guid planId,
        [FromBody] UpdateStripePricesRequest request)
    {
        var command = new UpdateSubscriptionPlanCommand(
            planId,
            request.StripePriceIdMonthly,
            request.StripePriceIdYearly
        );

        var result = await Mediator.Send(command);

        if (!result.Success)
        {
            return CreateResponse(result, ApiResponseStatusCode.NotFound, result.Message);
        }

        return CreateResponse(result, ApiResponseStatusCode.Success, result.Message);
    }
}

public record UpdateStripePricesRequest(
    string? StripePriceIdMonthly,
    string? StripePriceIdYearly
);
