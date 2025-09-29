using BackendApi.Data;
using BackendApi.Entities;
using BackendApi.Extensions;
using BackendApi.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using OpenAI;
using OpenAI.Chat;

namespace BackendApi.Features.RestaurantMenu.ParseMenuImage;

public class ParseMenuImageHandler(
    ApplicationDbContext context,
    IConfiguration configuration,
    IHttpContextAccessor httpContextAccessor) : IRequestHandler<ParseMenuImageCommand, ParseMenuImageResult>
{
    public async Task<ParseMenuImageResult> Handle(ParseMenuImageCommand request, CancellationToken cancellationToken)
    {
        // Validate user has access to restaurant
        var userId = httpContextAccessor.GetCurrentUserId();
        var userRestaurant = await context.UserRestaurants
            .FirstOrDefaultAsync(ur => ur.UserId == userId && ur.RestaurantId == request.RestaurantId, cancellationToken);

        if (userRestaurant == null)
            throw new UnauthorizedAccessException("User does not have access to this restaurant");

        // Get OpenAI API key
        var openAiApiKey = configuration["OpenAI:ApiKey"];
        if (string.IsNullOrEmpty(openAiApiKey))
            throw new InvalidOperationException("OpenAI API key not configured");

        // Parse annotations from JSON string
        var annotations = new List<AnnotationDto>();
        if (!string.IsNullOrEmpty(request.Annotations))
        {
            try
            {
                annotations = JsonSerializer.Deserialize<List<AnnotationDto>>(request.Annotations) ?? [];
            }
            catch (JsonException)
            {
                // Log warning but continue without annotations
            }
        }

        // Parse menu structure using OpenAI
        var parsedStructure = await ParseMenuWithOpenAI(request.Image, annotations, openAiApiKey);

        // Create menu and structure in database
        var menu = new Entities.RestaurantMenu
        {
            Id = Guid.NewGuid(),
            Name = parsedStructure.SuggestedMenuName,
            Description = parsedStructure.SuggestedMenuDescription,
            RestaurantId = request.RestaurantId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        context.RestaurantMenus.Add(menu);

        var result = new ParseMenuImageResult
        {
            MenuId = menu.Id,
            MenuName = menu.Name,
            MenuDescription = menu.Description,
            Categories = []
        };

        // Create categories and items
        foreach (var categoryData in parsedStructure.Categories)
        {
            var category = new MenuCategory
            {
                Id = Guid.NewGuid(),
                Name = categoryData.Name,
                Description = categoryData.Description,
                OrderIndex = categoryData.OrderIndex,
                RestaurantMenuId = menu.Id,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            context.MenuCategories.Add(category);

            var categoryDto = new ParsedCategoryDto
            {
                CategoryId = category.Id,
                Name = category.Name,
                Description = category.Description,
                OrderIndex = category.OrderIndex,
                Items = []
            };

            // Create menu items
            foreach (var itemData in categoryData.Items)
            {
                var menuItem = new MenuItem
                {
                    Id = Guid.NewGuid(),
                    Name = itemData.Name,
                    Description = itemData.Description,
                    Price = itemData.Price,
                    IsAvailable = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                context.MenuItems.Add(menuItem);

                var categoryItem = new MenuCategoryItem
                {
                    Id = Guid.NewGuid(),
                    MenuCategoryId = category.Id,
                    MenuItemId = menuItem.Id,
                    OrderIndex = itemData.OrderIndex
                };

                context.MenuCategoryItems.Add(categoryItem);

                categoryDto.Items.Add(new ParsedMenuItemDto
                {
                    ItemId = menuItem.Id,
                    Name = menuItem.Name,
                    Description = menuItem.Description,
                    Price = menuItem.Price,
                    OrderIndex = itemData.OrderIndex
                });
            }

            result.Categories.Add(categoryDto);
        }

        await context.SaveChangesAsync(cancellationToken);
        return result;
    }

    private async Task<OpenAIMenuStructure> ParseMenuWithOpenAI(IFormFile imageFile, List<AnnotationDto> annotations, string apiKey)
    {
        var client = new OpenAIClient(apiKey);

        // Convert image to base64
        using var memoryStream = new MemoryStream();
        await imageFile.CopyToAsync(memoryStream);
        var imageBytes = memoryStream.ToArray();
        var base64Image = Convert.ToBase64String(imageBytes);

        // Create enhanced OpenAI vision prompt for structure parsing
        var prompt = @"Analyze this menu image and extract the complete menu structure. This is a restaurant menu that needs to be parsed into categories and items.

IMPORTANT: Extract the ENTIRE menu structure, not just individual items. Focus on:
1. Identifying all menu categories/sections (like ""Appetizers"", ""Main Courses"", ""Desserts"", ""Beverages"", etc.)
2. For each category, extract all menu items within that section
3. Maintain the logical order of categories as they appear on the menu
4. Suggest an appropriate menu name and description

For each category, provide:
- Category name (required)
- Category description (if available, otherwise create a brief one)
- Order index (0, 1, 2, etc. based on menu position)
- All menu items in that category

For each menu item, provide:
- Name (required)
- Description (if available, otherwise create a brief one)
- Price (extract as number, use 0 if not found)
- Order index within the category (0, 1, 2, etc.)

Return the data as a JSON object with this EXACT structure:
{
  ""categories"": [
    {
      ""name"": ""Category Name"",
      ""description"": ""Category description"",
      ""orderIndex"": 0,
      ""items"": [
        {
          ""name"": ""Item Name"",
          ""description"": ""Item description"",
          ""price"": 12.99,
          ""orderIndex"": 0
        }
      ]
    }
  ],
  ""suggestedMenuName"": ""Restaurant Name - Main Menu"",
  ""suggestedMenuDescription"": ""Our carefully crafted selection of dishes""
}

Only extract actual menu items (food/drinks), not headers, footers, or other text. Be accurate with prices and names.";

        // Add annotation context if available
        if (annotations.Count > 0)
        {
            var categoryAnnotations = annotations.Where(a => a.Type == "category").ToList();
            var itemAnnotations = annotations.Where(a => a.Type == "item").ToList();
            var priceAnnotations = annotations.Where(a => a.Type == "price").ToList();

            if (categoryAnnotations.Count > 0 || itemAnnotations.Count > 0)
            {
                prompt += "\n\nUser has marked specific areas on the image:";

                if (categoryAnnotations.Count > 0)
                {
                    prompt += $"\n- {categoryAnnotations.Count} category sections marked";
                }

                if (itemAnnotations.Count > 0)
                {
                    prompt += $"\n- {itemAnnotations.Count} menu items marked";
                }

                if (priceAnnotations.Count > 0)
                {
                    prompt += $"\n- {priceAnnotations.Count} prices marked";
                }

                prompt += "\nPay special attention to these marked areas and use them to guide your parsing.";
            }
        }

        // Create chat completion with vision
        var response = await client.GetChatClient("gpt-4o").CompleteChatAsync(
            [
                new UserChatMessage(
                    ChatMessageContentPart.CreateTextPart(prompt),
                    ChatMessageContentPart.CreateImagePart(
                        BinaryData.FromBytes(imageBytes),
                        imageFile.ContentType ?? "image/jpeg",
                        ChatImageDetailLevel.High
                    )
                )
            ]
        );

        var content = response.Value.Content[0].Text;
        if (string.IsNullOrEmpty(content))
            throw new InvalidOperationException("No response from OpenAI");

        // Extract JSON from response
        var jsonMatch = System.Text.RegularExpressions.Regex.Match(content, @"\{[\s\S]*\}");
        if (!jsonMatch.Success)
            throw new InvalidOperationException("No valid JSON found in OpenAI response");

        try
        {
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };
            return JsonSerializer.Deserialize<OpenAIMenuStructure>(jsonMatch.Value, options)
                ?? throw new InvalidOperationException("Failed to deserialize menu structure");
        }
        catch (JsonException ex)
        {
            throw new InvalidOperationException($"Failed to parse OpenAI response: {ex.Message}");
        }
    }
}

// Internal DTOs for OpenAI response
internal class OpenAIMenuStructure
{
    public List<OpenAICategory> Categories { get; set; } = [];
    public string SuggestedMenuName { get; set; } = "";
    public string SuggestedMenuDescription { get; set; } = "";
}

internal class OpenAICategory
{
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public int OrderIndex { get; set; }
    public List<OpenAIMenuItem> Items { get; set; } = [];
}

internal class OpenAIMenuItem
{
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public decimal Price { get; set; }
    public int OrderIndex { get; set; }
}
