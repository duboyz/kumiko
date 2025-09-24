using BackendApi.Shared.Contracts;
using BackendApi.Features.RestaurantMenu.Shared;

namespace BackendApi.Features.RestaurantMenu.GetRestaurantMenus;

public record GetRestaurantMenusQuery(
    Guid RestaurantId
) : IQuery<GetRestaurantMenusResult>;

public record GetRestaurantMenusResult(
    List<RestaurantMenuDto> Menus
);
