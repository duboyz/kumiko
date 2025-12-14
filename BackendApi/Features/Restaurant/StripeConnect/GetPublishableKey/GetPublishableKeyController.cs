using BackendApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace BackendApi.Features.Restaurant.StripeConnect.GetPublishableKey;

[Route("api/stripe")]
[Tags("Stripe")]
public class GetPublishableKeyController(IConfiguration configuration) : ControllerBase
{
    [HttpGet("publishable-key")]
    [Microsoft.AspNetCore.Cors.EnableCors("AllowPublic")]
    public ActionResult<ApiResponse<string>> GetPublishableKey()
    {
        var publishableKey = configuration["Stripe:PublishableKey"];

        if (string.IsNullOrEmpty(publishableKey))
        {
            return BadRequest(new ApiResponse<string>
            {
                Success = false,
                StatusCode = ApiResponseStatusCode.BadRequest,
                Message = "Stripe publishable key not configured",
                Data = null
            });
        }

        return Ok(new ApiResponse<string>
        {
            Success = true,
            StatusCode = ApiResponseStatusCode.Success,
            Message = "Publishable key retrieved successfully",
            Data = publishableKey
        });
    }
}

