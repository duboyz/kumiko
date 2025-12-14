using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.Subscription.HandleStripeWebhook;

[Route("api/webhooks")]
[Tags("Webhook")]
public class HandleStripeWebhookController(IMediator mediator, ILogger<HandleStripeWebhookController> logger) : BaseController(mediator)
{
    [HttpPost("stripe")]
    public async Task<ActionResult<ApiResponse<HandleStripeWebhookResult>>> HandleWebhook()
    {
        // Use both Console and Logger to ensure output
        var timestamp = DateTime.UtcNow;
        Console.WriteLine($"[WEBHOOK] Received at {timestamp}");
        Console.Error.WriteLine($"[WEBHOOK] Received at {timestamp}"); // Also write to stderr
        logger.LogWarning($"WEBHOOK RECEIVED at {timestamp}"); // Use Warning level to bypass log filtering

        var payload = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
        var signature = HttpContext.Request.Headers["Stripe-Signature"].FirstOrDefault() ?? string.Empty;

        Console.WriteLine($"[WEBHOOK] Signature: {signature.Substring(0, Math.Min(20, signature.Length))}...");
        Console.WriteLine($"[WEBHOOK] Payload length: {payload?.Length} bytes");
        logger.LogWarning($"Webhook signature: {signature.Substring(0, Math.Min(20, signature.Length))}..., Payload: {payload?.Length} bytes");

        var command = new HandleStripeWebhookCommand(payload ?? string.Empty, signature);
        var result = await Mediator.Send(command);

        if (!result.Success)
        {
            Console.WriteLine($"[WEBHOOK] FAILED: {result.Message}");
            logger.LogWarning($"WEBHOOK FAILED: {result.Message}");
            return CreateResponse(result, ApiResponseStatusCode.BadRequest, result.Message);
        }

        Console.WriteLine("[WEBHOOK] PROCESSED SUCCESSFULLY");
        logger.LogWarning("WEBHOOK PROCESSED SUCCESSFULLY");
        return CreateResponse(result, ApiResponseStatusCode.Success, "Webhook processed successfully");
    }
}
