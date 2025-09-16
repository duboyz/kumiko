using BackendApi.Shared.Contracts;

namespace BackendApi.Features.RestaurantMenu.RemoveMenuItemFromCategory;

public record RemoveMenuItemFromCategoryCommand(
    Guid CategoryItemId
) : ICommand<RemoveMenuItemFromCategoryResult>;

public record RemoveMenuItemFromCategoryResult(
    bool Success
);
