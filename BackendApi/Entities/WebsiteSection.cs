namespace BackendApi.Entities;

public class WebsiteSection : BaseEntity
{
    public Guid WebsitePageId { get; set; }
    public WebsitePage WebsitePage { get; set; } = null!;

    public int SortOrder { get; set; }

    public HeroSection? HeroSection { get; set; }
    public RestaurantMenuSection? RestaurantMenuSection { get; set; }
}

public enum HeroSectionType
{
    ImageRight,
    BackgroundImage,
}

public class HeroSection : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? ImageUrl { get; set; } = string.Empty;
    public string? ImageAlt { get; set; }

    public string? BackgroundColor { get; set; }
    public string? TextColor { get; set; }
    public string? BackgroundOverlayColor { get; set; }
    public string? BackgroundImageUrl { get; set; }

    public string? ButtonText { get; set; }
    public string? ButtonUrl { get; set; }
    public string? ButtonTextColor { get; set; }
    public string? ButtonBackgroundColor { get; set; }

    public HeroSectionType Type { get; set; } = HeroSectionType.ImageRight;

    public Guid WebsiteSectionId { get; set; }
    public WebsiteSection WebsiteSection { get; set; } = null!;

}

public class RestaurantMenuSection : BaseEntity
{
    public Guid RestaurantMenuId { get; set; }
    public RestaurantMenu RestaurantMenu { get; set; } = null!;

    public bool AllowOrdering { get; set; } = true;

    public Guid WebsiteSectionId { get; set; }
    public WebsiteSection WebsiteSection { get; set; } = null!;
}