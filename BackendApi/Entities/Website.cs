namespace BackendApi.Entities;

public enum WebsiteType
{
    Restaurant,
    Hospitality,
}

public class Website : BaseEntity
{
    public required string Name { get; set; }
    public required string Subdomain { get; set; }
    public string? Description { get; set; }
    public Guid? RestaurantId { get; set; }
    public Guid? HospitalityId { get; set; }
    public bool IsPublished { get; set; }

    public WebsiteType Type { get; set; } = WebsiteType.Restaurant;

    // Navigation properties
    public Restaurant? Restaurant { get; set; } = null;
    public Hospitality? Hospitality { get; set; } = null;
    public ICollection<WebsitePage> Pages { get; set; } = new List<WebsitePage>();
}