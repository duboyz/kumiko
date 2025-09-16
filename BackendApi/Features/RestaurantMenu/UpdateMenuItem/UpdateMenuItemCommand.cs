using BackendApi.Shared.Contracts;

namespace BackendApi.Features.RestaurantMenu.UpdateMenuItem;

public record UpdateMenuItemCommand(
    Guid Id,
    string Name,
    string Description,
    decimal Price,
    bool IsAvailable
) : ICommand<UpdateMenuItemResult>;

public record UpdateMenuItemResult(
    Guid Id,
    string Name,
    string Description,
    decimal Price,
    bool IsAvailable,
    Guid RestaurantMenuId
);
