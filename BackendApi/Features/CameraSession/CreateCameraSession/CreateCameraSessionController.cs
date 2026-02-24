using BackendApi.Models;
using BackendApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.CameraSession.CreateCameraSession;

[Route("api/camera-session")]
[Tags("CameraSession")]
[ApiController]
public class CreateCameraSessionController(ICameraSessionService cameraSessionService) : ControllerBase
{
    [HttpPost("create")]
    public ActionResult<ApiResponse<CreateCameraSessionResult>> CreateSession()
    {
        var sessionId = cameraSessionService.CreateSession();
        return Ok(new ApiResponse<CreateCameraSessionResult>
        {
            Success = true,
            StatusCode = ApiResponseStatusCode.Success,
            Message = "Session created",
            Data = new CreateCameraSessionResult(sessionId)
        });
    }
}

public record CreateCameraSessionResult(string SessionId);
