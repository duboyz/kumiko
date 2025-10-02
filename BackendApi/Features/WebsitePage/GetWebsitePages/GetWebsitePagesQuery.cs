using BackendApi.Shared.Contracts;

namespace BackendApi.Features.WebsitePage.GetWebsitePages;

public record GetWebsitePagesQuery(
    Guid WebsiteId
) : IQuery<GetWebsitePagesResult>;

public record WebsitePageDetailsDto(
    Guid Id,
    string Slug,
    string Title,
    string? SeoTitle,
    string? SeoDescription,
    string? SeoKeywords,
    string Subdomain,
    Guid WebsiteId,
    List<WebsitePageSectionDto> Sections
);

public record WebsitePageSectionDto(
    Guid Id,
    int SortOrder,
    Guid WebsitePageId,
    WebsitePageHeroSectionDto? HeroSection,
    WebsitePageTextSectionDto? TextSection,
    WebsitePageTextAndImageSectionDto? TextAndImageSection,
    WebsitePageRestaurantMenuSectionDto? RestaurantMenuSection
);

public record WebsitePageHeroSectionDto(
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

public record WebsitePageTextSectionDto(
    Guid Id,
    string? Title,
    string? Text,
    BackendApi.Entities.TextAlignment AlignText,
    string? TextColor
);

public record WebsitePageTextAndImageSectionDto(
    Guid Id,
    string? Title,
    string? Content,
    string? ButtonText,
    string? ButtonUrl,
    string? ImageUrl,
    string? ImageAlt,
    string? TextColor,
    string? ButtonColor,
    string? ButtonTextColor,
    BackendApi.Entities.TextAlignment Alignment,
    bool ImageOnLeft
);

public record WebsitePageRestaurantMenuSectionDto(
    Guid Id,
    Guid RestaurantMenuId,
    bool AllowOrdering
);

public record GetWebsitePagesResult(
    List<WebsitePageDetailsDto> Pages
);