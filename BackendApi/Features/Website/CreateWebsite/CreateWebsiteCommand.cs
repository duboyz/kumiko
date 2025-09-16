using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Website.CreateWebsite;

public record CreateWebsiteCommand(
    string Name,
    string Subdomain,
    string? Description = null,
    Guid? EntityId = null,
    string EntityType = "Restaurant"
) : ICommand<CreateWebsiteResult>;

public record CreateWebsiteResult(Guid WebsiteId);