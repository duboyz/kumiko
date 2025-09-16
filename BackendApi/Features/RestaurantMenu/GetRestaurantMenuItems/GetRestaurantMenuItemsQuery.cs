using BackendApi.Shared.Contracts;

namespace BackendApi.Features.RestaurantMenu.GetRestaurantMenuItems;

public record GetRestaurantMenuItemsQuery(
    Guid RestaurantMenuId
) : IQuery<GetRestaurantMenuItemsResult>;

public record GetRestaurantMenuItemsResult(
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
