using BackendApi.Shared.Contracts;

namespace BackendApi.Features.WebsitePage.CreateWebsitePage;

public record CreateWebsitePageCommand(
    string Slug,
    string Title,
    string? SeoTitle,
    string? SeoDescription,
    string? SeoKeywords,
    Guid WebsiteId
) : ICommand<CreateWebsitePageResult>;

public record CreateWebsitePageResult(
    Guid PageId
);