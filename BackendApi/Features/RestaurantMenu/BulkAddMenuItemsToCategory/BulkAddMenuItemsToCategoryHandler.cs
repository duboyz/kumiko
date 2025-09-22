using BackendApi.Data;
using BackendApi.Entities;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.RestaurantMenu.BulkAddMenuItemsToCategory;

public class BulkAddMenuItemsToCategoryHandler(ApplicationDbContext context) : ICommandHandler<BulkAddMenuItemsToCategoryCommand, BulkAddMenuItemsToCategoryResult>
{
    public async Task<BulkAddMenuItemsToCategoryResult> Handle(BulkAddMenuItemsToCategoryCommand request, CancellationToken cancellationToken)
    {
        var createdCategoryItemIds = new List<Guid>();
        var skippedReasons = new List<string>();
        var itemsAdded = 0;
        var itemsSkipped = 0;

        // Verify menu category exists
        var menuCategory = await context.MenuCategories
            .FirstOrDefaultAsync(c => c.Id == request.MenuCategoryId, cancellationToken);

        if (menuCategory == null)
        {
            throw new ArgumentException("Menu category not found");
        }

        // Get all menu items that exist
        var existingMenuItems = await context.MenuItems
            .Where(i => request.MenuItemIds.Contains(i.Id))
            .ToListAsync(cancellationToken);

        var existingMenuItemIds = existingMenuItems.Select(i => i.Id).ToHashSet();

        // Check which items are already in this category
        var existingCategoryItems = await context.MenuCategoryItems
            .Where(ci => ci.MenuCategoryId == request.MenuCategoryId &&
                        request.MenuItemIds.Contains(ci.MenuItemId))
            .ToListAsync(cancellationToken);

        var existingCategoryItemIds = existingCategoryItems.Select(ci => ci.MenuItemId).ToHashSet();

        // Process each menu item
        var orderIndex = request.StartOrderIndex;
        var categoryItemsToAdd = new List<MenuCategoryItem>();

        foreach (var menuItemId in request.MenuItemIds)
        {
            // Check if menu item exists
            if (!existingMenuItemIds.Contains(menuItemId))
            {
                skippedReasons.Add($"Menu item {menuItemId} not found");
                itemsSkipped++;
                continue;
            }

            // Check if already in category
            if (existingCategoryItemIds.Contains(menuItemId))
            {
                skippedReasons.Add($"Menu item {menuItemId} is already in this category");
                itemsSkipped++;
                continue;
            }

            // Create category item
            var categoryItem = new MenuCategoryItem
            {
                Id = Guid.NewGuid(),
                MenuItemId = menuItemId,
                MenuCategoryId = request.MenuCategoryId,
                OrderIndex = orderIndex,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            categoryItemsToAdd.Add(categoryItem);
            createdCategoryItemIds.Add(categoryItem.Id);
            itemsAdded++;
            orderIndex++;
        }

        // Bulk insert all category items
        if (categoryItemsToAdd.Any())
        {
            context.MenuCategoryItems.AddRange(categoryItemsToAdd);
            await context.SaveChangesAsync(cancellationToken);
        }

        return new BulkAddMenuItemsToCategoryResult(
            createdCategoryItemIds.ToArray(),
            itemsAdded,
            itemsSkipped,
            skippedReasons.ToArray()
        );
    }
}
