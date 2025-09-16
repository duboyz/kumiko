using BackendApi.Shared.Contracts;

namespace BackendApi.Features.RestaurantMenu.GetAllRestaurantMenuItems;

public record GetAllRestaurantMenuItemsQuery(
    Guid RestaurantId
) : IQuery<GetAllRestaurantMenuItemsResult>;

public record GetAllRestaurantMenuItemsResult(
    List<MenuItemDto> MenuItems
);

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
