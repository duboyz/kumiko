using BackendApi.Features.MenuImport.ParseMenuImage;
using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;


[Route("api/menu-import")]
[Tags("MenuImport")]
[Authorize]
public class ParseMenuImageController(IMediator mediator) : BaseController(mediator)
{
    [HttpPost("parse-image")]
    public async Task<ActionResult<ApiResponse<ParseMenuImageResult>>> ParseMenuImage(
        [FromForm] IFormFile image,
        [FromForm] Guid restaurantId,
        [FromForm] string? annotations = null)
    {
        if (image == null || image.Length == 0)
        {
            return BadRequest(CreateErrorResponse("No image provided"));
        }

        if (restaurantId == Guid.Empty)
        {
            return BadRequest(CreateErrorResponse("Restaurant ID is required"));
        }

        // Validate file size (max 10MB)
        if (image.Length > 10 * 1024 * 1024)
        {
            return BadRequest(CreateErrorResponse("Image file is too large. Maximum size is 10MB."));
        }

        // Parse annotations if provided
        var annotationsList = new List<MenuAnnotation>();
        if (!string.IsNullOrEmpty(annotations))
        {
            try
            {
                annotationsList = JsonSerializer.Deserialize<List<MenuAnnotation>>(annotations) ?? new List<MenuAnnotation>();
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
            await image.CopyToAsync(memoryStream);
            imageData = memoryStream.ToArray();
        }

        var command = new ParseMenuImageCommand
        {
            RestaurantId = restaurantId,
            ImageData = imageData,
            ImageMimeType = image.ContentType ?? "image/jpeg",
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
