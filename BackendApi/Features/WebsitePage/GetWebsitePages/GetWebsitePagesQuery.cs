using BackendApi.Shared.Contracts;

namespace BackendApi.Features.WebsitePage.GetWebsitePages;

public record GetWebsitePagesQuery(
    Guid WebsiteId
) : IQuery<GetWebsitePagesResult>;

public record WebsitePageDto(
    Guid Id,
    string Slug,
    string Title,
    string? SeoTitle,
    string? SeoDescription,
    string? SeoKeywords,
    string Subdomain,
    Guid WebsiteId,
    List<WebsiteSectionDto> Sections
);

public record WebsiteSectionDto(
    Guid Id,
    int SortOrder,
    Guid WebsitePageId,
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
    BackendApi.Entities.HeroSectionType Type
);

public record TextSectionDto(
    Guid Id,
    string? Title,
    string? Text,
    BackendApi.Entities.TextAlignment AlignText,
    string? TextColor
);

public record RestaurantMenuSectionDto(
    Guid Id,
    Guid RestaurantMenuId,
    bool AllowOrdering
);

public record GetWebsitePagesResult(
    List<WebsitePageDto> Pages
);