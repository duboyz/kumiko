using BackendApi.Shared.Contracts;

namespace BackendApi.Features.RestaurantMenu.UpdateMenuCategory;

public record UpdateMenuCategoryCommand(
    Guid Id,
    string Name,
    string Description,
    int OrderIndex
) : ICommand<UpdateMenuCategoryResult>;

public record UpdateMenuCategoryResult(
    Guid Id,
    string Name,
    string Description,
    int OrderIndex,
    Guid RestaurantMenuId
);
