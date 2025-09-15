namespace BackendApi.Entities;

public class Website : BaseEntity
{
    public required string Name { get; set; }
    public required string Subdomain { get; set; }
    public string? Description { get; set; }
    public required Guid RestaurantId { get; set; }
    public bool IsPublished { get; set; }

    // Navigation properties
    public Restaurant Restaurant { get; set; } = null!;
    public ICollection<WebsitePage> Pages { get; set; } = new List<WebsitePage>();
}