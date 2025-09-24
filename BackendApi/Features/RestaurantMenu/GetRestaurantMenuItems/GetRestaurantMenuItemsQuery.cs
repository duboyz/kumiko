using BackendApi.Shared.Contracts;
using BackendApi.Features.RestaurantMenu.Shared;

namespace BackendApi.Features.RestaurantMenu.GetRestaurantMenuItems;

public record GetRestaurantMenuItemsQuery(
    Guid RestaurantMenuId
) : IQuery<GetRestaurantMenuItemsResult>;

public record GetRestaurantMenuItemsResult(
    List<MenuItemDto> MenuItems
);
