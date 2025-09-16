using BackendApi.Entities;
using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.WebsiteSection.UpdateHeroSection;

[Route("api/section/hero")]
[Tags("WebsiteSection")]
[Authorize]
public class UpdateHeroSectionController(IMediator mediator) : BaseController(mediator)
{
    [HttpPut("{heroSectionId}")]
    public async Task<ActionResult<ApiResponse<UpdateHeroSectionResult>>> UpdateHeroSection(
        Guid heroSectionId,
        [FromBody] UpdateHeroSectionRequest request)
    {
        var command = new UpdateHeroSectionCommand(
            heroSectionId,
            request.Title,
            request.Description,
            request.ImageUrl,
            request.ImageAlt,
            request.BackgroundColor,
            request.TextColor,
            request.BackgroundOverlayColor,
            request.BackgroundImageUrl,
            request.ButtonText,
            request.ButtonUrl,
            request.ButtonTextColor,
            request.ButtonBackgroundColor,
            Enum.Parse<HeroSectionType>(request.Type)
        );

        var result = await Mediator.Send(command);
        return CreateResponse(result, ApiResponseStatusCode.Success, "Hero section updated successfully");
    }
}

public record UpdateHeroSectionRequest
{
    public string Title { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string? ImageUrl { get; init; }
    public string? ImageAlt { get; init; }
    public string? BackgroundColor { get; init; }
    public string? TextColor { get; init; }
    public string? BackgroundOverlayColor { get; init; }
    public string? BackgroundImageUrl { get; init; }
    public string? ButtonText { get; init; }
    public string? ButtonUrl { get; init; }
    public string? ButtonTextColor { get; init; }
    public string? ButtonBackgroundColor { get; init; }
    public string Type { get; init; } = string.Empty;
}