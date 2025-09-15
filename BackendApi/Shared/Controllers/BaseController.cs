using BackendApi.Models;
using BackendApi.Shared.Results;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Shared.Controllers;

[ApiController]
public abstract class BaseController : ControllerBase
{
    protected readonly IMediator Mediator;

    protected BaseController(IMediator mediator)
    {
        Mediator = mediator;
    }

    /// <summary>
    /// Creates a standardized API response from direct data
    /// </summary>
    protected ActionResult<ApiResponse<T>> CreateResponse<T>(T data, ApiResponseStatusCode statusCode = ApiResponseStatusCode.Success, string? message = null)
    {
        return Ok(new ApiResponse<T>
        {
            Success = true,
            StatusCode = statusCode,
            Message = message,
            Data = data
        });
    }

    /// <summary>
    /// Creates a standardized API response without data
    /// </summary>
    protected ActionResult<ApiResponse<object>> CreateResponse(ApiResponseStatusCode statusCode = ApiResponseStatusCode.Success, string? message = null)
    {
        return Ok(new ApiResponse<object>
        {
            Success = true,
            StatusCode = statusCode,
            Message = message,
            Data = null
        });
    }



    private static ApiResponseStatusCode DetermineErrorStatusCode(string? error)
    {
        if (string.IsNullOrEmpty(error))
            return ApiResponseStatusCode.InternalServerError;

        var lowerError = error.ToLowerInvariant();

        return lowerError switch
        {
            var e when e.Contains("not found") => ApiResponseStatusCode.NotFound,
            var e when e.Contains("unauthorized") || e.Contains("invalid email or password") => ApiResponseStatusCode.Unauthorized,
            var e when e.Contains("forbidden") || e.Contains("access denied") => ApiResponseStatusCode.Forbidden,
            var e when e.Contains("validation") || e.Contains("invalid") || e.Contains("required") => ApiResponseStatusCode.BadRequest,
            _ => ApiResponseStatusCode.InternalServerError
        };
    }
}
