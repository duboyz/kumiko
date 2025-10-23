using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.Subscription.InitializeTrial;

[Route("api/subscriptions")]
[Tags("Subscription")]
[Authorize]
public class InitializeTrialController(IMediator mediator) : BaseController(mediator)
{
    [HttpPost("initialize-trial")]
    public async Task<ActionResult<ApiResponse<InitializeTrialResult>>> InitializeTrial()
    {
        var command = new InitializeTrialCommand();
        var result = await Mediator.Send(command);

        if (!result.Success)
        {
            return CreateResponse(result, ApiResponseStatusCode.BadRequest, result.Message);
        }

        return CreateResponse(result, ApiResponseStatusCode.Success, result.Message);
    }
}
