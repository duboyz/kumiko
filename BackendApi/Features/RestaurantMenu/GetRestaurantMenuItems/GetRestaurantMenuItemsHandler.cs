using BackendApi.Data;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.RestaurantMenu.GetRestaurantMenuItems;

public class GetRestaurantMenuItemsHandler(ApplicationDbContext context) : IQueryHandler<GetRestaurantMenuItemsQuery, GetRestaurantMenuItemsResult>
{
    public async Task<GetRestaurantMenuItemsResult> Handle(GetRestaurantMenuItemsQuery request, CancellationToken cancellationToken)
    {
        // Verify restaurant menu exists
        var restaurantMenu = await context.RestaurantMenus
            .FirstOrDefaultAsync(m => m.Id == request.RestaurantMenuId, cancellationToken);

        if (restaurantMenu == null)
        {
            throw new ArgumentException("Restaurant menu not found");
        }

        var menuItems = await context.MenuItems
            .Where(i => i.RestaurantMenuId == request.RestaurantMenuId)
            .OrderBy(i => i.Name)
            .ToListAsync(cancellationToken);

        var menuItemDtos = menuItems.Select(item => new MenuItemDto(
            item.Id,
            item.Name,
            item.Description,
            item.Price,
            item.IsAvailable,
            item.RestaurantMenuId,
            item.CreatedAt,
            item.UpdatedAt ?? DateTime.UtcNow
        )).ToList();

        return new GetRestaurantMenuItemsResult(menuItemDtos);
    }
}
