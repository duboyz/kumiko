using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Website.GetRestaurantWebsites;

public record GetRestaurantWebsitesQuery(
    Guid? EntityId = null,
    string? EntityType = null
) : IQuery<List<WebsiteDto>>;

public record WebsiteDto(
    Guid Id,
    string Name,
    string Subdomain,
    string? Description,
    bool IsPublished,
    Guid RestaurantId,
    string RestaurantName
);