using BackendApi.Shared.Contracts;

namespace BackendApi.Features.RestaurantMenu.CreateMenuItem;

public record CreateMenuItemCommand(
    string Name,
    string Description,
    decimal Price,
    bool IsAvailable,
    Guid RestaurantMenuId
) : ICommand<CreateMenuItemResult>;

public record CreateMenuItemResult(
    Guid Id,
    string Name,
    string Description,
    decimal Price,
    bool IsAvailable,
    Guid RestaurantMenuId
);
