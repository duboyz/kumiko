using BackendApi.Features.MenuImport.ParseMenuImage;
using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace BackendApi.Features.ParseMenuImage;

public class ParseMenuImageFormRequest
{
    public IFormFile Image { get; set; } = null!;
    public Guid RestaurantId { get; set; }
    public string? Annotations { get; set; }
}


[Route("api/menu-import")]
[Tags("MenuImport")]
[Authorize]
public class ParseMenuImageController(IMediator mediator) : BaseController(mediator)
{
    /// <summary>
    /// Parse menu image
    /// </summary>
    /// <param name="request">Form data containing image, restaurant ID, and optional annotations</param>
    /// <returns>Parsed menu structure with categories and items</returns>
    [HttpPost("parse-image")]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<ApiResponse<ParseMenuImageResult>>> ParseMenuImage(
        [FromForm] ParseMenuImageFormRequest request)
    {
        if (request.Image == null || request.Image.Length == 0)
        {
            return BadRequest(CreateErrorResponse("No image provided"));
        }

        if (request.RestaurantId == Guid.Empty)
        {
            return BadRequest(CreateErrorResponse("Restaurant ID is required"));
        }

        // Validate file size (max 10MB)
        if (request.Image.Length > 10 * 1024 * 1024)
        {
            return BadRequest(CreateErrorResponse("Image file is too large. Maximum size is 10MB."));
        }

        // Parse annotations if provided
        var annotationsList = new List<MenuAnnotation>();
        if (!string.IsNullOrEmpty(request.Annotations))
        {
            try
            {
                annotationsList = JsonSerializer.Deserialize<List<MenuAnnotation>>(request.Annotations) ?? [];
            }
            catch (JsonException)
            {
                return BadRequest(CreateErrorResponse("Invalid annotations format"));
            }
        }

        // Read image data
        byte[] imageData;
        using (var memoryStream = new MemoryStream())
        {
            await request.Image.CopyToAsync(memoryStream);
            imageData = memoryStream.ToArray();
        }

        var command = new ParseMenuImageCommand
        {
            RestaurantId = request.RestaurantId,
            ImageData = imageData,
            ImageMimeType = request.Image.ContentType ?? "image/jpeg",
            Annotations = annotationsList
        };

        var result = await Mediator.Send(command);
        return CreateResponse(result, ApiResponseStatusCode.Success, "Menu image parsed successfully");
    }

    private static ApiResponse<object> CreateErrorResponse(string message)
    {
        return new ApiResponse<object>
        {
            Success = false,
            Message = message,
            Data = null
        };
    }
}
