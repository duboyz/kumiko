using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Website.GetWebsiteBySubdomain;

public record GetWebsiteBySubdomainQuery(
    string Subdomain
) : IQuery<GetWebsiteBySubdomainResult>;

public record GetWebsiteBySubdomainResult(
    Guid Id,
    string Name,
    string Subdomain,
    string? Description,
    bool IsPublished,
    string Type,
    Guid? RestaurantId,
    string? RestaurantName,
    IEnumerable<WebsitePageDto> Pages
);

public record WebsitePageDto(
    Guid Id,
    string Title,
    string Slug,
    IEnumerable<WebsiteSectionDto> Sections
);

public record WebsiteSectionDto(
    Guid Id,
    int SortOrder,
    HeroSectionDto? HeroSection,
    TextSectionDto? TextSection,
    RestaurantMenuSectionDto? RestaurantMenuSection
);

public record HeroSectionDto(
    Guid Id,
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
    string Type
);

public record TextSectionDto(
    Guid Id,
    string? Title,
    string? Text,
    string AlignText,
    string? TextColor
);

public record RestaurantMenuSectionDto(
    Guid Id,
    Guid RestaurantMenuId,
    bool AllowOrdering
);