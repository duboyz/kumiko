namespace BackendApi.Features.RestaurantMenu.Shared;

public record MenuItemDto(
    Guid Id,
    string Name,
    string Description,
    decimal Price,
    bool IsAvailable,
    Guid RestaurantMenuId,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record MenuCategoryDto(
    Guid Id,
    string Name,
    string Description,
    int OrderIndex,
    Guid RestaurantMenuId,
    List<MenuCategoryItemDto> MenuCategoryItems,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record MenuCategoryItemDto(
    Guid Id,
    Guid MenuCategoryId,
    Guid MenuItemId,
    int OrderIndex,
    MenuItemDto? MenuItem,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record RestaurantMenuDto(
    Guid Id,
    string Name,
    string Description,
    Guid RestaurantId,
    List<MenuCategoryDto> Categories,
    DateTime CreatedAt,
    DateTime UpdatedAt
);
