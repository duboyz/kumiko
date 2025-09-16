using BackendApi.Shared.Contracts;

namespace BackendApi.Features.RestaurantMenu.AddMenuItemToCategory;

public record AddMenuItemToCategoryCommand(
    Guid MenuItemId,
    Guid MenuCategoryId,
    int OrderIndex
) : ICommand<AddMenuItemToCategoryResult>;

public record AddMenuItemToCategoryResult(
    Guid Id,
    Guid MenuCategoryId,
    Guid MenuItemId,
    int OrderIndex
);
