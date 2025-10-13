using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.Subscription.HandleStripeWebhook;

[Route("api/webhooks")]
[Tags("Webhook")]
public class HandleStripeWebhookController(IMediator mediator) : BaseController(mediator)
{
    [HttpPost("stripe")]
    public async Task<ActionResult<ApiResponse<HandleStripeWebhookResult>>> HandleWebhook()
    {
        var payload = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
        var signature = HttpContext.Request.Headers["Stripe-Signature"].ToString();

        var command = new HandleStripeWebhookCommand(payload, signature);
        var result = await Mediator.Send(command);

        if (!result.Success)
        {
            return CreateResponse(result, ApiResponseStatusCode.BadRequest, result.Message);
        }

        return CreateResponse(result, ApiResponseStatusCode.Success, "Webhook processed successfully");
    }
}
