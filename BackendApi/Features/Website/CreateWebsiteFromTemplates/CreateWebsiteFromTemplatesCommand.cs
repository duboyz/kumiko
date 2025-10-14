using BackendApi.Entities;
using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Website.CreateWebsiteFromTemplates;

public record CreateWebsiteFromTemplatesCommand(
    Guid RestaurantId,
    string WebsiteName,
    string Subdomain,
    string? Description,
    List<PageTemplateRequest> PageTemplates,
    Guid? MenuId
) : ICommand<CreateWebsiteFromTemplatesResult>;

public record PageTemplateRequest(
    PageTemplate TemplateType,
    string? CustomTitle = null,
    string? CustomSlug = null
);

public record CreateWebsiteFromTemplatesResult(
    Guid WebsiteId,
    string WebsiteName,
    string Subdomain,
    List<CreatedPageResult> CreatedPages
);

public record CreatedPageResult(
    Guid PageId,
    string Title,
    string Slug,
    string TemplateType
);
