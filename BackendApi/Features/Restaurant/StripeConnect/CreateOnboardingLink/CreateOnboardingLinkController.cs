using BackendApi.Controllers;
using BackendApi.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.Restaurant.StripeConnect.CreateOnboardingLink;

[Route("api/restaurant")]
[Tags("StripeConnect")]
public class CreateOnboardingLinkController : BaseAuthenticatedController
{
    private readonly IMediator _mediator;

    public CreateOnboardingLinkController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("{restaurantId}/stripe-connect/onboarding-link")]
    public async Task<ActionResult<ApiResponse<CreateOnboardingLinkResult>>> CreateOnboardingLink([FromRoute] Guid restaurantId)
    {
        var command = new CreateOnboardingLinkCommand(restaurantId);
        var result = await _mediator.Send(command);

        return Ok(new ApiResponse<CreateOnboardingLinkResult>
        {
            Success = true,
            StatusCode = ApiResponseStatusCode.Success,
            Message = "Onboarding link created successfully",
            Data = result
        });
    }
}

