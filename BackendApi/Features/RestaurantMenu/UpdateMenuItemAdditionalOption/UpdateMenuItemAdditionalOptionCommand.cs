using BackendApi.Shared.Contracts;

namespace BackendApi.Features.RestaurantMenu.UpdateMenuItemAdditionalOption;

public record UpdateMenuItemAdditionalOptionCommand(
    Guid Id,
    string Name,
    string Description,
    decimal Price,
    int OrderIndex,
    bool IsAvailable
) : ICommand<UpdateMenuItemAdditionalOptionResult>;

public record UpdateMenuItemAdditionalOptionResult(
    Guid Id,
    Guid MenuItemId,
    string Name,
    string Description,
    decimal Price,
    int OrderIndex,
    bool IsAvailable
);

