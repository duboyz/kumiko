using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.Restaurant.StripeConnect.HandleConnectWebhook;

[Route("api/webhooks")]
[Tags("Webhook")]
public class HandleConnectWebhookController(IMediator mediator, ILogger<HandleConnectWebhookController> logger) : BaseController(mediator)
{
    [HttpPost("stripe-connect")]
    public async Task<ActionResult<ApiResponse<HandleConnectWebhookResult>>> HandleWebhook()
    {
        var timestamp = DateTime.UtcNow;
        logger.LogInformation("[CONNECT WEBHOOK] Received at {Timestamp}", timestamp);

        var payload = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
        var signature = HttpContext.Request.Headers["Stripe-Signature"].FirstOrDefault() ?? string.Empty;

        logger.LogInformation("[CONNECT WEBHOOK] Signature: {SignaturePrefix}..., Payload: {PayloadLength} bytes",
            signature?.Substring(0, Math.Min(20, signature?.Length ?? 0)), payload?.Length);

        var command = new HandleConnectWebhookCommand(payload ?? string.Empty, signature);
        var result = await Mediator.Send(command);

        if (!result.Success)
        {
            logger.LogWarning("[CONNECT WEBHOOK] FAILED: {Message}", result.Message);
            return CreateResponse(result, ApiResponseStatusCode.BadRequest, result.Message);
        }

        logger.LogInformation("[CONNECT WEBHOOK] PROCESSED SUCCESSFULLY");
        return CreateResponse(result, ApiResponseStatusCode.Success, "Webhook processed successfully");
    }
}

