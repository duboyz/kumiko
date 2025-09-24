using System.Text;
using System.Text.Json;

namespace BackendApi.Services;

public class OpenAiService : IOpenAiService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<OpenAiService> _logger;
    private readonly string _apiKey;

    public OpenAiService(HttpClient httpClient, IConfiguration configuration, ILogger<OpenAiService> logger)
    {
        _httpClient = httpClient;
        _apiKey = configuration["OpenAI:ApiKey"] ?? throw new InvalidOperationException("OpenAI API key not configured");
        _logger = logger;
    }

    public async Task<ParseMenuImageResult> ParseMenuImageAsync(
        byte[] imageData,
        string mimeType,
        List<MenuAnnotation> annotations,
        CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Starting menu image parsing with {AnnotationCount} annotations", annotations.Count);

            // Convert image to base64
            var base64Image = Convert.ToBase64String(imageData);

            // Build prompt with annotations
            var prompt = BuildPromptWithAnnotations(annotations);

            _logger.LogInformation("Calling OpenAI API with prompt length: {PromptLength}", prompt.Length);

            // Call OpenAI API using simple HTTP request (same as frontend)
            var requestBody = new
            {
                model = "gpt-4o",
                messages = new[]
                {
                    new
                    {
                        role = "user",
                        content = new object[]
                        {
                            new { type = "text", text = prompt },
                            new
                            {
                                type = "image_url",
                                image_url = new
                                {
                                    url = $"data:{mimeType};base64,{base64Image}",
                                    detail = "high"
                                }
                            }
                        }
                    }
                },
                max_tokens = 2000
            };

            var json = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _apiKey);

            var response = await _httpClient.PostAsync("https://api.openai.com/v1/chat/completions", content, cancellationToken);
            var responseJson = await response.Content.ReadAsStringAsync(cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                throw new InvalidOperationException($"OpenAI API error: {response.StatusCode} - {responseJson}");
            }

            var openAiResponse = JsonSerializer.Deserialize<OpenAiResponse>(responseJson);
            var aiContent = openAiResponse?.choices?[0]?.message?.content;
            if (string.IsNullOrEmpty(aiContent))
            {
                throw new InvalidOperationException("No content in OpenAI response");
            }

            _logger.LogInformation("OpenAI response content length: {ContentLength}", aiContent.Length);

            // Parse the JSON response
            var result = ParseOpenAiResponse(aiContent);

            _logger.LogInformation("Successfully parsed menu structure with {CategoryCount} categories and {TotalItems} items",
                result.Categories.Count,
                result.Categories.Sum(c => c.Items.Count));

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error parsing menu image with OpenAI");
            throw;
        }
    }

    private string BuildPromptWithAnnotations(List<MenuAnnotation> annotations)
    {
        var promptBuilder = new StringBuilder();

        promptBuilder.AppendLine("You are an expert at analyzing restaurant menu images and extracting structured menu data.");
        promptBuilder.AppendLine("Analyze this menu image and extract the menu structure, including categories and individual menu items.");
        promptBuilder.AppendLine();
        promptBuilder.AppendLine("Return your response as a JSON object with this exact structure:");
        promptBuilder.AppendLine("{");
        promptBuilder.AppendLine("  \"categories\": [");
        promptBuilder.AppendLine("    {");
        promptBuilder.AppendLine("      \"name\": \"Category Name\",");
        promptBuilder.AppendLine("      \"description\": \"Category description\",");
        promptBuilder.AppendLine("      \"orderIndex\": 0,");
        promptBuilder.AppendLine("      \"items\": [");
        promptBuilder.AppendLine("        {");
        promptBuilder.AppendLine("          \"name\": \"Item Name\",");
        promptBuilder.AppendLine("          \"description\": \"Item description\",");
        promptBuilder.AppendLine("          \"price\": 12.99,");
        promptBuilder.AppendLine("          \"orderIndex\": 0");
        promptBuilder.AppendLine("        }");
        promptBuilder.AppendLine("      ]");
        promptBuilder.AppendLine("    }");
        promptBuilder.AppendLine("  ],");
        promptBuilder.AppendLine("  \"suggestedMenuName\": \"Restaurant Name - Menu\",");
        promptBuilder.AppendLine("  \"suggestedMenuDescription\": \"Our carefully crafted selection of dishes\"");
        promptBuilder.AppendLine("}");
        promptBuilder.AppendLine();
        promptBuilder.AppendLine("Guidelines:");
        promptBuilder.AppendLine("- Extract ALL menu items and categories visible in the image");
        promptBuilder.AppendLine("- Use the exact text as it appears in the menu");
        promptBuilder.AppendLine("- Convert prices to decimal numbers (e.g., $12.99 becomes 12.99)");
        promptBuilder.AppendLine("- If no price is visible, use 0.00");
        promptBuilder.AppendLine("- Order categories and items as they appear from top to bottom");
        promptBuilder.AppendLine("- Be thorough and accurate in your extraction");
        promptBuilder.AppendLine();

        if (annotations.Count > 0)
        {
            promptBuilder.AppendLine("The user has provided annotations to help guide your analysis:");
            foreach (var annotation in annotations)
            {
                promptBuilder.AppendLine($"- {annotation.Type}: Rectangle at ({annotation.X}, {annotation.Y}) with size {annotation.Width}x{annotation.Height}");
            }
            promptBuilder.AppendLine();
            promptBuilder.AppendLine("Use these annotations as guidance for identifying the different types of content:");
            promptBuilder.AppendLine("- 'category' annotations indicate menu section headers");
            promptBuilder.AppendLine("- 'item' annotations indicate individual menu items");
            promptBuilder.AppendLine("- 'price' annotations indicate pricing information");
            promptBuilder.AppendLine("- 'description' annotations indicate item descriptions");
            promptBuilder.AppendLine();
        }

        return promptBuilder.ToString();
    }

    private ParseMenuImageResult ParseOpenAiResponse(string content)
    {
        try
        {
            // Extract JSON from the response (in case there's extra text)
            var jsonMatch = System.Text.RegularExpressions.Regex.Match(content, @"\{[\s\S]*\}");
            var jsonContent = jsonMatch.Success ? jsonMatch.Value : content;

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };

            var parsedStructure = JsonSerializer.Deserialize<ParsedMenuStructureDto>(jsonContent, options);

            if (parsedStructure == null)
            {
                throw new InvalidOperationException("Failed to deserialize OpenAI response");
            }

            // Convert to result format
            return new ParseMenuImageResult(
                parsedStructure.Categories ?? new List<ParsedCategory>(),
                parsedStructure.SuggestedMenuName ?? "Menu",
                parsedStructure.SuggestedMenuDescription ?? "Our carefully crafted selection of dishes"
            );
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "Failed to parse OpenAI JSON response. Content: {Content}", content);
            throw new InvalidOperationException("Failed to parse menu structure from AI response", ex);
        }
    }

    private class ParsedMenuStructureDto
    {
        public List<ParsedCategory>? Categories { get; set; }
        public string? SuggestedMenuName { get; set; }
        public string? SuggestedMenuDescription { get; set; }
    }

    private class OpenAiResponse
    {
        public OpenAiChoice[]? choices { get; set; }
    }

    private class OpenAiChoice
    {
        public OpenAiMessage? message { get; set; }
    }

    private class OpenAiMessage
    {
        public string? content { get; set; }
    }
}
