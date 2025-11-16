using BackendApi.Shared.Contracts;
using BackendApi.Entities;

namespace BackendApi.Features.RestaurantMenu.GetMenuById;

public record GetMenuByIdQuery(
    Guid MenuId
) : IQuery<GetMenuByIdResult>;

public record GetMenuByIdResult(
    Guid Id,
    string Name,
    string? Description,
    Guid RestaurantId,
    Currency Currency,
    IEnumerable<MenuByIdCategoryDto> Categories
);

public record MenuByIdCategoryDto(
    Guid Id,
    string Name,
    string? Description,
    int OrderIndex,
    IEnumerable<MenuByIdCategoryItemDto> MenuCategoryItems
);

public record MenuByIdCategoryItemDto(
    Guid Id,
    int OrderIndex,
    MenuByIdItemDto? MenuItem
);

public record MenuByIdItemDto(
    Guid Id,
    string Name,
    string? Description,
    decimal? Price,
    bool HasOptions,
    IEnumerable<MenuByIdItemOptionDto> Options,
    IEnumerable<MenuByIdItemAdditionalOptionDto> AdditionalOptions,
    IEnumerable<MenuByIdAllergenDto> Allergens,
    bool IsAvailable
);

public record MenuByIdAllergenDto(
    Guid Id,
    string Name,
    string Description
);

public record MenuByIdItemOptionDto(
    Guid Id,
    string Name,
    string? Description,
    decimal Price,
    int OrderIndex
);

public record MenuByIdItemAdditionalOptionDto(
    Guid Id,
    string Name,
    string? Description,
    decimal Price,
    int OrderIndex,
    bool IsAvailable
);