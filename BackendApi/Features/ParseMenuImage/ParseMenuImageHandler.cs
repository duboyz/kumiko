using BackendApi.Data;
using BackendApi.Services;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.MenuImport.ParseMenuImage;

public class ParseMenuImageHandler(
    IOpenAiService openAiService,
    ApplicationDbContext context,
    ILogger<ParseMenuImageHandler> logger) : ICommandHandler<ParseMenuImageCommand, ParseMenuImageResult>
{
    public async Task<ParseMenuImageResult> Handle(ParseMenuImageCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Processing menu image parsing for restaurant {RestaurantId}", request.RestaurantId);

        // Validate restaurant exists
        var restaurant = await context.Restaurants
            .FirstOrDefaultAsync(r => r.Id == request.RestaurantId, cancellationToken);

        if (restaurant == null)
        {
            logger.LogWarning("Restaurant {RestaurantId} not found", request.RestaurantId);
            throw new ArgumentException("Restaurant not found");
        }

        // Validate image data
        if (request.ImageData.Length == 0)
        {
            logger.LogWarning("No image data provided for restaurant {RestaurantId}", request.RestaurantId);
            throw new ArgumentException("No image data provided");
        }

        // Validate mime type
        if (!IsValidImageMimeType(request.ImageMimeType))
        {
            logger.LogWarning("Invalid image mime type {MimeType} for restaurant {RestaurantId}",
                request.ImageMimeType, request.RestaurantId);
            throw new ArgumentException("Invalid image format. Only JPEG, PNG, and WebP images are supported.");
        }

        logger.LogInformation("Calling OpenAI service for restaurant {RestaurantId} with {AnnotationCount} annotations",
            request.RestaurantId, request.Annotations.Count);

        // Call OpenAI service
        var result = await openAiService.ParseMenuImageAsync(
            request.ImageData,
            request.ImageMimeType,
            request.Annotations,
            cancellationToken);

        logger.LogInformation("Successfully parsed menu for restaurant {RestaurantId}: {CategoryCount} categories, {TotalItems} items",
            request.RestaurantId,
            result.Categories.Count,
            result.Categories.Sum(c => c.Items.Count));

        return result;
    }

    private static bool IsValidImageMimeType(string mimeType)
    {
        var validTypes = new[] { "image/jpeg", "image/jpg", "image/png", "image/webp" };
        return validTypes.Contains(mimeType.ToLowerInvariant());
    }
}
