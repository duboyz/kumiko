using BackendApi.Models;
using BackendApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.CameraSession.UploadCameraImage;

[Route("api/camera-session")]
[Tags("CameraSession")]
[ApiController]
public class UploadCameraImageController(ICameraSessionService cameraSessionService) : ControllerBase
{
    [HttpPost("{sessionId}/upload")]
    [Consumes("multipart/form-data")]
    [ProducesResponseType(typeof(ApiResponse<UploadCameraImageResult>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<UploadCameraImageResult>>> UploadImage(
        string sessionId,
        [FromForm] IFormFile image)
    {
        if (image == null || image.Length == 0)
        {
            return BadRequest(new ApiResponse<object>
            {
                Success = false,
                StatusCode = ApiResponseStatusCode.BadRequest,
                Message = "No image provided"
            });
        }

        if (!cameraSessionService.SessionExists(sessionId))
        {
            return NotFound(new ApiResponse<object>
            {
                Success = false,
                StatusCode = ApiResponseStatusCode.NotFound,
                Message = "Session not found"
            });
        }

        // Validate file size (max 10MB)
        if (image.Length > 10 * 1024 * 1024)
        {
            return BadRequest(new ApiResponse<object>
            {
                Success = false,
                StatusCode = ApiResponseStatusCode.BadRequest,
                Message = "Image file is too large. Maximum size is 10MB."
            });
        }

        // Read image data
        byte[] imageData;
        using (var memoryStream = new MemoryStream())
        {
            await image.CopyToAsync(memoryStream);
            imageData = memoryStream.ToArray();
        }

        cameraSessionService.AddImageToSession(sessionId, imageData, image.ContentType ?? "image/jpeg", image.FileName);

        return Ok(new ApiResponse<UploadCameraImageResult>
        {
            Success = true,
            StatusCode = ApiResponseStatusCode.Success,
            Message = "Image uploaded successfully",
            Data = new UploadCameraImageResult(true, "Image uploaded successfully")
        });
    }
}

public record UploadCameraImageResult(bool Success, string Message);
