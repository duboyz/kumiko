using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Models;

public class ApiActionResult<T>(T? data, ApiResponseStatusCode statusCode = ApiResponseStatusCode.Success, string? message = null, bool success = true) : IActionResult
{
    public async Task ExecuteResultAsync(ActionContext context)
    {
        var response = new ApiResponse<T>
        {
            Success = success,
            StatusCode = statusCode,
            Message = message,
            Data = data,
            Timestamp = DateTime.UtcNow
        };

        // IMPORTANT: Always return HTTP 200 to maintain compatibility with frontend
        var objectResult = new ObjectResult(response)
        {
            StatusCode = 200
        };

        await objectResult.ExecuteResultAsync(context);
    }
}

public static class ApiActionResultExtensions
{
    public static ApiActionResult<T> ApiSuccess<T>(this ControllerBase controller, T data, string? message = "")
    {
        return new ApiActionResult<T>(data, ApiResponseStatusCode.Success, message, true);
    }

    public static ApiActionResult<T> ApiSuccess<T>(this ControllerBase controller, T data, ApiResponseStatusCode statusCode, string? message = "")
    {
        var success = statusCode == ApiResponseStatusCode.Success || statusCode == ApiResponseStatusCode.Created;
        return new ApiActionResult<T>(data, statusCode, message, success);
    }

    public static ApiActionResult<T> ApiCreated<T>(this ControllerBase controller, T data, string? message = "")
    {
        return new ApiActionResult<T>(data, ApiResponseStatusCode.Created, message, true);
    }

    public static ApiActionResult<T?> ApiBadRequest<T>(this ControllerBase controller, string message)
    {
        return new ApiActionResult<T?>(default, ApiResponseStatusCode.BadRequest, message, false);
    }

    public static ApiActionResult<T?> ApiUnauthorized<T>(this ControllerBase controller, string message)
    {
        return new ApiActionResult<T?>(default, ApiResponseStatusCode.Unauthorized, message, false);
    }

    public static ApiActionResult<T?> ApiNotFound<T>(this ControllerBase controller, string message)
    {
        return new ApiActionResult<T?>(default, ApiResponseStatusCode.NotFound, message, false);
    }
}