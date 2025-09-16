using BackendApi.Shared.Contracts;

namespace BackendApi.Features.RestaurantMenu.DeleteMenuCategory;

public record DeleteMenuCategoryCommand(
    Guid Id
) : ICommand<DeleteMenuCategoryResult>;

public record DeleteMenuCategoryResult(
    bool Success
);
