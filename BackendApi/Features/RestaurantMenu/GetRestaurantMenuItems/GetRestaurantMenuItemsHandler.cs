using BackendApi.Data;
using BackendApi.Shared.Contracts;
using BackendApi.Features.RestaurantMenu.Shared;
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
            .Include(i => i.Options.OrderBy(o => o.OrderIndex))
            .Include(i => i.Allergens)
                .ThenInclude(ma => ma.Allergen)
            .Where(i => i.RestaurantMenuId == request.RestaurantMenuId)
            .OrderBy(i => i.Name)
            .ToListAsync(cancellationToken);

        var menuItemDtos = menuItems.Select(item => new MenuItemDto(
            item.Id,
            item.Name,
            item.Description,
            item.Price,
            item.HasOptions,
            item.IsAvailable,
            item.RestaurantMenuId,
            item.Options.Select(o => new MenuItemOptionDto(
                o.Id,
                o.Name,
                o.Description,
                o.Price,
                o.OrderIndex,
                o.MenuItemId
            )).ToList(),
            item.Allergens.Select(ma => new AllergenDto(
                ma.Allergen.Id,
                ma.Allergen.Name,
                ma.Allergen.Description
            )).ToList(),
            item.CreatedAt,
            item.UpdatedAt ?? DateTime.UtcNow
        )).ToList();

        return new GetRestaurantMenuItemsResult(menuItemDtos);
    }
}
