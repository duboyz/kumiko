using BackendApi.Shared.Contracts;
using BackendApi.Features.RestaurantMenu.Shared;

namespace BackendApi.Features.RestaurantMenu.GetAllRestaurantMenuItems;

public record GetAllRestaurantMenuItemsQuery(
    Guid RestaurantId
) : IQuery<GetAllRestaurantMenuItemsResult>;

public record GetAllRestaurantMenuItemsResult(
    List<MenuItemDto> MenuItems
);
