namespace BackendApi.Entities;

public class WebsitePage : BaseEntity
{
    public string Slug { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;

    public string? SeoTitle { get; set; }
    public string? SeoDescription { get; set; }
    public string? SeoKeywords { get; set; }

    public ICollection<WebsiteSection> Sections { get; set; } = [];

    public required string Subdomain { get; set; }

    public Guid WebsiteId { get; set; }
    public Website Website { get; set; } = null!;
}