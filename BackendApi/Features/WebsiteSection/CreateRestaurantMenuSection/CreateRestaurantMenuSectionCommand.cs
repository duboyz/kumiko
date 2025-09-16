using BackendApi.Shared.Contracts;

namespace BackendApi.Features.WebsiteSection.CreateRestaurantMenuSection;

public record CreateRestaurantMenuSectionCommand(
    Guid WebsitePageId,
    int SortOrder,
    Guid RestaurantMenuId,
    bool AllowOrdering
) : ICommand<CreateRestaurantMenuSectionResult>;

public record CreateRestaurantMenuSectionResult(
    Guid SectionId,
    Guid RestaurantMenuSectionId
);