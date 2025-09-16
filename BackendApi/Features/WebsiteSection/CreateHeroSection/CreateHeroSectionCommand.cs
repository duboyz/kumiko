using BackendApi.Entities;
using BackendApi.Shared.Contracts;

namespace BackendApi.Features.WebsiteSection.CreateHeroSection;

public record CreateHeroSectionCommand(
    Guid WebsitePageId,
    int SortOrder,
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
) : ICommand<CreateHeroSectionResult>;

public record CreateHeroSectionResult(
    Guid SectionId,
    Guid HeroSectionId
);