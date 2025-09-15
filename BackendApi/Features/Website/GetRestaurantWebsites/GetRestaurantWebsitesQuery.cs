using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Website.GetRestaurantWebsites;

public record GetRestaurantWebsitesQuery(
    Guid? EntityId = null,
    string? EntityType = null
) : IQuery<GetRestaurantWebsitesResult>;

public record GetRestaurantWebsitesResult(List<WebsiteDto> Websites);

public record WebsiteDto(
    Guid Id,
    string Name,
    string Subdomain,
    string? Description,
    bool IsPublished,
    Guid RestaurantId,
    string RestaurantName
);