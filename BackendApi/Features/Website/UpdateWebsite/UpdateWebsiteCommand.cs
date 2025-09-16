using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Website.UpdateWebsite;

public record UpdateWebsiteCommand(
    Guid WebsiteId,
    string? Name,
    string? Description,
    bool? IsPublished
) : ICommand<UpdateWebsiteResult>;

public record UpdateWebsiteResult(
    Guid WebsiteId,
    bool IsPublished
);