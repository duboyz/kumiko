namespace BackendApi.Entities;

public class WebsiteSection : BaseEntity
{
    public Guid WebsitePageId { get; set; }
    public WebsitePage WebsitePage { get; set; } = null!;

    public int SortOrder { get; set; }

    public HeroSection? HeroSection { get; set; }
    public TextSection? TextSection { get; set; }
    public RestaurantMenuSection? RestaurantMenuSection { get; set; }
    public TextAndImageSection? TextAndImageSection { get; set; }
}

public enum HeroSectionType
{
    ImageRight,
    BackgroundImage,
}

public enum TextAlignment
{
    Left,
    Center,
    Right,
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

public class TextSection : BaseEntity
{
    public string? Title { get; set; }
    public string? Text { get; set; }
    public TextAlignment AlignText { get; set; } = TextAlignment.Left;
    public string? TextColor { get; set; }

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

public class TextAndImageSection : BaseEntity
{
    public string? Title { get; set; }
    public string? Content { get; set; }
    public string? ButtonText { get; set; }
    public string? ButtonUrl { get; set; }
    public string? ImageUrl { get; set; }
    public string? ImageAlt { get; set; }

    public string? TextColor { get; set; }
    public string? ButtonColor { get; set; }
    public string? ButtonTextColor { get; set; }

    public TextAlignment Alignment { get; set; } = TextAlignment.Left;
    public bool ImageOnLeft { get; set; } = false; // false means image on right, true means image on left

    public Guid WebsiteSectionId { get; set; }
    public WebsiteSection WebsiteSection { get; set; } = null!;
}