using BackendApi.Data;
using BackendApi.Entities;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.RestaurantMenu.AddMenuItemToCategory;

public class AddMenuItemToCategoryHandler(ApplicationDbContext context) : ICommandHandler<AddMenuItemToCategoryCommand, AddMenuItemToCategoryResult>
{
    public async Task<AddMenuItemToCategoryResult> Handle(AddMenuItemToCategoryCommand request, CancellationToken cancellationToken)
    {
        // Verify menu item exists
        var menuItem = await context.MenuItems
            .FirstOrDefaultAsync(i => i.Id == request.MenuItemId, cancellationToken);

        if (menuItem == null)
        {
            throw new ArgumentException("Menu item not found");
        }

        // Verify menu category exists
        var menuCategory = await context.MenuCategories
            .FirstOrDefaultAsync(c => c.Id == request.MenuCategoryId, cancellationToken);

        if (menuCategory == null)
        {
            throw new ArgumentException("Menu category not found");
        }

        // Check if the item is already in this category
        var existingCategoryItem = await context.MenuCategoryItems
            .FirstOrDefaultAsync(ci => ci.MenuItemId == request.MenuItemId && ci.MenuCategoryId == request.MenuCategoryId, cancellationToken);

        if (existingCategoryItem != null)
        {
            throw new ArgumentException("Menu item is already in this category");
        }

        var categoryItem = new MenuCategoryItem
        {
            Id = Guid.NewGuid(),
            MenuItemId = request.MenuItemId,
            MenuCategoryId = request.MenuCategoryId,
            OrderIndex = request.OrderIndex,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        context.MenuCategoryItems.Add(categoryItem);
        await context.SaveChangesAsync(cancellationToken);

        return new AddMenuItemToCategoryResult(
            categoryItem.Id,
            categoryItem.MenuCategoryId,
            categoryItem.MenuItemId,
            categoryItem.OrderIndex
        );
    }
}
