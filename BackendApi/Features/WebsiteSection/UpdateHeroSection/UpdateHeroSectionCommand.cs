using BackendApi.Entities;
using BackendApi.Shared.Contracts;

namespace BackendApi.Features.WebsiteSection.UpdateHeroSection;

public record UpdateHeroSectionCommand(
    Guid HeroSectionId,
    string Title,
    string Description,
    string? ImageUrl,
    string? ImageAlt,
    string? BackgroundColor,
    string? TextColor,
    string? BackgroundOverlayColor,
    string? BackgroundImageUrl,
    string? ButtonText,
    string? ButtonUrl,
    string? ButtonTextColor,
    string? ButtonBackgroundColor,
    HeroSectionType Type
) : ICommand<UpdateHeroSectionResult>;

public record UpdateHeroSectionResult(
    Guid HeroSectionId
);