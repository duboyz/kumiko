using BackendApi.Shared.Contracts;

namespace BackendApi.Features.WebsiteSection.UpdateRestaurantMenuSection;

public record UpdateRestaurantMenuSectionCommand(
    Guid RestaurantMenuSectionId,
    Guid RestaurantMenuId,
    bool AllowOrdering
) : ICommand<UpdateRestaurantMenuSectionResult>;

public record UpdateRestaurantMenuSectionResult(
    Guid RestaurantMenuSectionId
);