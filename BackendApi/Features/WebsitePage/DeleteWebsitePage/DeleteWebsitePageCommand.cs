using BackendApi.Shared.Contracts;

namespace BackendApi.Features.WebsitePage.DeleteWebsitePage;

public record DeleteWebsitePageCommand(
    Guid PageId
) : ICommand<DeleteWebsitePageResult>;

public record DeleteWebsitePageResult(
    bool Success
);
