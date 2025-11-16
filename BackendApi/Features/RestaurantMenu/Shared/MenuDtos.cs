namespace BackendApi.Features.RestaurantMenu.Shared;

public record MenuItemDto(
    Guid Id,
    string Name,
    string Description,
    decimal? Price,
    bool HasOptions,
    bool IsAvailable,
    Guid RestaurantMenuId,
    List<MenuItemOptionDto> Options,
    List<MenuItemAdditionalOptionDto> AdditionalOptions,
    List<MenuItemAllergenDto> Allergens,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record MenuItemOptionDto(
    Guid Id,
    string Name,
    string Description,
    decimal Price,
    int OrderIndex,
    Guid MenuItemId
);

public record MenuItemAdditionalOptionDto(
    Guid Id,
    string Name,
    string Description,
    decimal Price,
    int OrderIndex,
    bool IsAvailable,
    Guid MenuItemId
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

public record MenuItemAllergenDto(
    Guid Id,
    string Name,
    string Description
);
