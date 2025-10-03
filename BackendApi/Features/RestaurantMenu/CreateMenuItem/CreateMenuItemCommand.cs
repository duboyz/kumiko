using BackendApi.Shared.Contracts;

namespace BackendApi.Features.RestaurantMenu.CreateMenuItem;

public record CreateMenuItemCommand(
    string Name,
    string Description,
    decimal? Price,
    bool HasOptions,
    List<CreateMenuItemOptionDto>? Options,
    bool IsAvailable,
    Guid RestaurantMenuId
) : ICommand<CreateMenuItemResult>;

public record CreateMenuItemOptionDto(
    string Name,
    string Description,
    decimal Price,
    int OrderIndex
);

public record CreateMenuItemResult(
    Guid Id,
    string Name,
    string Description,
    decimal? Price,
    bool HasOptions,
    bool IsAvailable,
    Guid RestaurantMenuId
);
