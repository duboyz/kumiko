using BackendApi.Shared.Contracts;

namespace BackendApi.Features.WebsitePage.CreateWebsitePage;

public record CreateWebsitePageCommand(
    string Slug,
    string Title,
    string? SeoTitle,
    string? SeoDescription,
    string? SeoKeywords,
    Guid WebsiteId,
    string? TemplateId,
    List<CreatePageSectionCommand>? Sections
) : ICommand<CreateWebsitePageResult>;

public record CreatePageSectionCommand(
    string Type,
    int Order,
    Dictionary<string, object> Config
);

public record CreateWebsitePageResult(
    Guid PageId
);