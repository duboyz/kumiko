using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.Subscription.InitializeTrialForExistingUsers;

[Route("api/subscriptions")]
[Tags("Subscription")]
[Authorize] // TODO: Add admin-only authorization in production
public class InitializeTrialForExistingUsersController(IMediator mediator) : BaseController(mediator)
{
    /// <summary>
    /// Initializes trial subscriptions for existing users who don't have one.
    /// This is a one-time migration endpoint for users who registered before the subscription feature.
    /// </summary>
    [HttpPost("initialize-trials-for-existing-users")]
    public async Task<ActionResult<ApiResponse<InitializeTrialForExistingUsersResult>>> InitializeTrialsForExistingUsers()
    {
        var command = new InitializeTrialForExistingUsersCommand();
        var result = await Mediator.Send(command);

        if (result.Success)
        {
            return CreateResponse(result, ApiResponseStatusCode.Success, result.Message);
        }
        else
        {
            return CreateResponse(result, ApiResponseStatusCode.BadRequest, result.Message);
        }
    }
}