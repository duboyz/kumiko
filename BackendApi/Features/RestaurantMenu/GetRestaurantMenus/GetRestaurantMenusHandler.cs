using BackendApi.Data;
using BackendApi.Shared.Contracts;
using BackendApi.Features.RestaurantMenu.Shared;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.RestaurantMenu.GetRestaurantMenus;

public class GetRestaurantMenusHandler(ApplicationDbContext context) : IQueryHandler<GetRestaurantMenusQuery, GetRestaurantMenusResult>
{
    public async Task<GetRestaurantMenusResult> Handle(GetRestaurantMenusQuery request, CancellationToken cancellationToken)
    {
        // Verify restaurant exists and user has access (add user authorization later)
        var restaurant = await context.Restaurants
            .FirstOrDefaultAsync(r => r.Id == request.RestaurantId, cancellationToken);

        if (restaurant == null)
        {
            throw new ArgumentException("Restaurant not found");
        }

        var menus = await context.RestaurantMenus
            .Where(m => m.RestaurantId == request.RestaurantId)
            .Include(m => m.Categories.OrderBy(c => c.OrderIndex))
            .ThenInclude(c => c.MenuCategoryItems.OrderBy(ci => ci.OrderIndex))
            .ThenInclude(ci => ci.MenuItem)
            .ThenInclude(mi => mi!.Options.OrderBy(o => o.OrderIndex))
            .Include(m => m.Categories)
            .ThenInclude(c => c.MenuCategoryItems)
            .ThenInclude(ci => ci.MenuItem)
            .ThenInclude(mi => mi!.Allergens)
            .ThenInclude(ma => ma.Allergen)
            .ToListAsync(cancellationToken);

        var menuDtos = menus.Select(menu => new RestaurantMenuDto(
            menu.Id,
            menu.Name,
            menu.Description,
            menu.RestaurantId,
            menu.Categories.Select(category => new MenuCategoryDto(
                category.Id,
                category.Name,
                category.Description,
                category.OrderIndex,
                category.RestaurantMenuId,
                category.MenuCategoryItems.Select(categoryItem => new MenuCategoryItemDto(
                    categoryItem.Id,
                    categoryItem.MenuCategoryId,
                    categoryItem.MenuItemId,
                    categoryItem.OrderIndex,
                    categoryItem.MenuItem != null ? new MenuItemDto(
                        categoryItem.MenuItem.Id,
                        categoryItem.MenuItem.Name,
                        categoryItem.MenuItem.Description,
                        categoryItem.MenuItem.Price,
                        categoryItem.MenuItem.HasOptions,
                        categoryItem.MenuItem.IsAvailable,
                        categoryItem.MenuItem.RestaurantMenuId,
                        categoryItem.MenuItem.Options.Select(o => new MenuItemOptionDto(
                            o.Id,
                            o.Name,
                            o.Description,
                            o.Price,
                            o.OrderIndex,
                            o.MenuItemId
                        )).ToList(),
                        categoryItem.MenuItem.Allergens.Select(ma => new MenuItemAllergenDto(
                            ma.Allergen.Id,
                            ma.Allergen.Name,
                            ma.Allergen.Description
                        )).ToList(),
                        categoryItem.MenuItem.CreatedAt,
                        categoryItem.MenuItem.UpdatedAt ?? DateTime.UtcNow
                    ) : null,
                    categoryItem.CreatedAt,
                    categoryItem.UpdatedAt ?? DateTime.UtcNow
                )).ToList(),
                category.CreatedAt,
                category.UpdatedAt ?? DateTime.UtcNow
            )).ToList(),
            menu.CreatedAt,
            menu.UpdatedAt ?? DateTime.UtcNow
        )).ToList();

        return new GetRestaurantMenusResult(menuDtos);
    }
}
