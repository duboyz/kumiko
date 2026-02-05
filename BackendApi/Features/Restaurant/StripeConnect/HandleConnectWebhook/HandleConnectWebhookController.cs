using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.Restaurant.StripeConnect.HandleConnectWebhook;

[Route("api/webhooks")]
[Tags("Webhook")]
[AllowAnonymous] // Webhooks from Stripe don't use authentication
public class HandleConnectWebhookController(IMediator mediator, ILogger<HandleConnectWebhookController> logger) : BaseController(mediator)
{
    [HttpPost("stripe-connect")]
    public async Task<ActionResult<ApiResponse<HandleConnectWebhookResult>>> HandleWebhook()
    {
        var timestamp = DateTime.UtcNow;
        Console.WriteLine($"[CONNECT WEBHOOK] Received at {timestamp}");
        Console.Error.WriteLine($"[CONNECT WEBHOOK] Received at {timestamp}");
        logger.LogWarning($"[CONNECT WEBHOOK] Received at {timestamp}");

        var payload = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
        var signature = HttpContext.Request.Headers["Stripe-Signature"].FirstOrDefault() ?? string.Empty;

        Console.WriteLine($"[CONNECT WEBHOOK] Signature: {signature?.Substring(0, Math.Min(20, signature?.Length ?? 0))}...");
        Console.WriteLine($"[CONNECT WEBHOOK] Payload length: {payload?.Length} bytes");
        
        // Log first 500 chars of payload for debugging
        if (!string.IsNullOrEmpty(payload))
        {
            var preview = payload.Length > 500 ? payload.Substring(0, 500) + "..." : payload;
            Console.WriteLine($"[CONNECT WEBHOOK] Payload preview: {preview}");
            logger.LogWarning($"[CONNECT WEBHOOK] Payload preview: {preview}");
        }
        
        logger.LogWarning($"[CONNECT WEBHOOK] Signature: {signature?.Substring(0, Math.Min(20, signature?.Length ?? 0))}..., Payload: {payload?.Length} bytes");

        var command = new HandleConnectWebhookCommand(payload ?? string.Empty, signature);
        var result = await Mediator.Send(command);

        if (!result.Success)
        {
            Console.WriteLine($"[CONNECT WEBHOOK] FAILED: {result.Message}");
            logger.LogWarning("[CONNECT WEBHOOK] FAILED: {Message}", result.Message);
            return CreateResponse(result, ApiResponseStatusCode.BadRequest, result.Message);
        }

        Console.WriteLine("[CONNECT WEBHOOK] PROCESSED SUCCESSFULLY");
        logger.LogWarning("[CONNECT WEBHOOK] PROCESSED SUCCESSFULLY");
        return CreateResponse(result, ApiResponseStatusCode.Success, "Webhook processed successfully");
    }
}

