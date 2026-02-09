using BackendApi.Models;
using BackendApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.CameraSession.GetCameraSessionImages;

[Route("api/camera-session")]
[Tags("CameraSession")]
[ApiController]
public class GetCameraSessionImagesController(ICameraSessionService cameraSessionService) : ControllerBase
{
    [HttpGet("{sessionId}/images")]
    public ActionResult<ApiResponse<GetCameraSessionImagesResult>> GetImages(string sessionId)
    {
        if (!cameraSessionService.SessionExists(sessionId))
        {
            return NotFound(new ApiResponse<object>
            {
                Success = false,
                StatusCode = ApiResponseStatusCode.NotFound,
                Message = "Session not found"
            });
        }

        var images = cameraSessionService.GetSessionImages(sessionId);
        var imageDtos = images.Select(img => new CameraSessionImageDto
        {
            Id = img.Id,
            MimeType = img.MimeType,
            FileName = img.FileName,
            UploadedAt = img.UploadedAt
        }).ToList();

        return Ok(new ApiResponse<GetCameraSessionImagesResult>
        {
            Success = true,
            StatusCode = ApiResponseStatusCode.Success,
            Message = "Images retrieved successfully",
            Data = new GetCameraSessionImagesResult(imageDtos)
        });
    }

    [HttpGet("{sessionId}/images/{imageId}")]
    public ActionResult GetImage(string sessionId, string imageId)
    {
        if (!cameraSessionService.SessionExists(sessionId))
        {
            return NotFound();
        }

        var images = cameraSessionService.GetSessionImages(sessionId);
        var image = images.FirstOrDefault(img => img.Id == imageId);

        if (image == null)
        {
            return NotFound();
        }

        return File(image.ImageData, image.MimeType, image.FileName);
    }
}

public record GetCameraSessionImagesResult(List<CameraSessionImageDto> Images);

public class CameraSessionImageDto
{
    public string Id { get; set; } = string.Empty;
    public string MimeType { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public DateTime UploadedAt { get; set; }
}
