using BackendApi.Data;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.RestaurantMenu.DeleteRestaurantMenu;

public class DeleteRestaurantMenuHandler(ApplicationDbContext context) : ICommandHandler<DeleteRestaurantMenuCommand, DeleteRestaurantMenuResult>
{
    public async Task<DeleteRestaurantMenuResult> Handle(DeleteRestaurantMenuCommand request, CancellationToken cancellationToken)
    {
        var restaurantMenu = await context.RestaurantMenus
            .Include(rm => rm.Categories)
                .ThenInclude(c => c.MenuCategoryItems)
            .FirstOrDefaultAsync(rm => rm.Id == request.Id, cancellationToken);

        if (restaurantMenu == null)
        {
            throw new ArgumentException("Restaurant menu not found");
        }

        // Get all menu items that belong to this restaurant menu
        var menuItems = await context.MenuItems
            .Include(mi => mi.MenuCategoryItems)
            .Include(mi => mi.Options)
            .Include(mi => mi.Allergens)
            .Where(mi => mi.RestaurantMenuId == request.Id)
            .ToListAsync(cancellationToken);

        // Remove menu item allergens
        foreach (var menuItem in menuItems)
        {
            context.MenuItemAllergens.RemoveRange(menuItem.Allergens);
            context.MenuItemOptions.RemoveRange(menuItem.Options);
        }

        // Remove all menu category items first
        foreach (var category in restaurantMenu.Categories)
        {
            context.MenuCategoryItems.RemoveRange(category.MenuCategoryItems);
        }

        // Remove all menu items
        context.MenuItems.RemoveRange(menuItems);

        // Remove all categories
        context.MenuCategories.RemoveRange(restaurantMenu.Categories);

        // Remove the restaurant menu
        context.RestaurantMenus.Remove(restaurantMenu);

        await context.SaveChangesAsync(cancellationToken);

        return new DeleteRestaurantMenuResult(true);
    }
}
