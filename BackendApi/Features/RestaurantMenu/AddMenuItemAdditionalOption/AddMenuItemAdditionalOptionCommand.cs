using BackendApi.Shared.Contracts;

namespace BackendApi.Features.RestaurantMenu.AddMenuItemAdditionalOption;

public record AddMenuItemAdditionalOptionCommand(
    Guid MenuItemId,
    string Name,
    string Description,
    decimal Price,
    int OrderIndex,
    bool IsAvailable
) : ICommand<AddMenuItemAdditionalOptionResult>;

public record AddMenuItemAdditionalOptionResult(
    Guid Id,
    Guid MenuItemId,
    string Name,
    string Description,
    decimal Price,
    int OrderIndex,
    bool IsAvailable
);

