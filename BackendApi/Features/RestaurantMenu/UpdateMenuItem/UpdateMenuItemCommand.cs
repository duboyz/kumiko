using BackendApi.Shared.Contracts;

namespace BackendApi.Features.RestaurantMenu.UpdateMenuItem;

public record UpdateMenuItemCommand(
    Guid Id,
    string Name,
    string Description,
    decimal? Price,
    bool HasOptions,
    List<UpdateMenuItemOptionDto>? Options,
    bool IsAvailable
) : ICommand<UpdateMenuItemResult>;

public record UpdateMenuItemOptionDto(
    Guid? Id,
    string Name,
    string Description,
    decimal Price,
    int OrderIndex
);

public record UpdateMenuItemResult(
    Guid Id,
    string Name,
    string Description,
    decimal? Price,
    bool HasOptions,
    bool IsAvailable,
    Guid RestaurantMenuId
);
