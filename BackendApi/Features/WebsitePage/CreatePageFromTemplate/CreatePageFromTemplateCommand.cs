using BackendApi.Entities;
using BackendApi.Shared.Contracts;

namespace BackendApi.Features.WebsitePage.CreatePageFromTemplate;

public record CreatePageFromTemplateCommand(
    Guid WebsiteId,
    PageTemplate Template,
    string? CustomTitle,
    string? CustomSlug,
    // Template-specific fields
    Guid? RestaurantMenuId // For MenuPage template
) : ICommand<CreatePageFromTemplateResult>;

public record CreatePageFromTemplateResult(
    Guid PageId,
    string Title,
    string Slug
);
