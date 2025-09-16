using BackendApi.Shared.Contracts;

namespace BackendApi.Features.RestaurantMenu.CreateMenuCategory;

public record CreateMenuCategoryCommand(
    string Name,
    string Description,
    int OrderIndex,
    Guid RestaurantMenuId
) : ICommand<CreateMenuCategoryResult>;

public record CreateMenuCategoryResult(
    Guid Id,
    string Name,
    string Description,
    int OrderIndex,
    Guid RestaurantMenuId
);
