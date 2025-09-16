using BackendApi.Shared.Contracts;

namespace BackendApi.Features.RestaurantMenu.GetMenuById;

public record GetMenuByIdQuery(
    Guid MenuId
) : IQuery<GetMenuByIdResult>;

public record GetMenuByIdResult(
    Guid Id,
    string Name,
    string? Description,
    IEnumerable<MenuCategoryDto> Categories
);

public record MenuCategoryDto(
    Guid Id,
    string Name,
    string? Description,
    int OrderIndex,
    IEnumerable<MenuCategoryItemDto> MenuCategoryItems
);

public record MenuCategoryItemDto(
    Guid Id,
    int OrderIndex,
    MenuItemDto? MenuItem
);

public record MenuItemDto(
    Guid Id,
    string Name,
    string? Description,
    decimal Price,
    bool IsAvailable
);