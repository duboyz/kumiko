using BackendApi.Data;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.RestaurantMenu.GetAllRestaurantMenuItems;

public class GetAllRestaurantMenuItemsHandler(ApplicationDbContext context) : IQueryHandler<GetAllRestaurantMenuItemsQuery, GetAllRestaurantMenuItemsResult>
{
    public async Task<GetAllRestaurantMenuItemsResult> Handle(GetAllRestaurantMenuItemsQuery request, CancellationToken cancellationToken)
    {
        // Verify restaurant exists
        var restaurant = await context.Restaurants
            .FirstOrDefaultAsync(r => r.Id == request.RestaurantId, cancellationToken);

        if (restaurant == null)
        {
            throw new ArgumentException("Restaurant not found");
        }

        // Get all menu items for ALL menus of this restaurant
        var menuItems = await context.MenuItems
            .Where(i => context.RestaurantMenus
                .Where(m => m.RestaurantId == request.RestaurantId)
                .Select(m => m.Id)
                .Contains(i.RestaurantMenuId))
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

        return new GetAllRestaurantMenuItemsResult(menuItemDtos);
    }
}
