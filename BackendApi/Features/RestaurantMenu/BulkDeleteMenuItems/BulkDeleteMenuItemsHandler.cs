using BackendApi.Data;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.RestaurantMenu.BulkDeleteMenuItems;

public class BulkDeleteMenuItemsHandler(ApplicationDbContext context) : ICommandHandler<BulkDeleteMenuItemsCommand, BulkDeleteMenuItemsResult>
{
    public async Task<BulkDeleteMenuItemsResult> Handle(BulkDeleteMenuItemsCommand request, CancellationToken cancellationToken)
    {
        var itemsDeleted = 0;
        var itemsNotFound = 0;
        var notFoundReasons = new List<string>();

        // Get all menu items that exist
        var existingMenuItems = await context.MenuItems
            .Where(i => request.MenuItemIds.Contains(i.Id))
            .ToListAsync(cancellationToken);

        var existingMenuItemIds = existingMenuItems.Select(i => i.Id).ToHashSet();

        // Check which items don't exist
        foreach (var menuItemId in request.MenuItemIds)
        {
            if (!existingMenuItemIds.Contains(menuItemId))
            {
                notFoundReasons.Add($"Menu item {menuItemId} not found");
                itemsNotFound++;
            }
        }

        // Delete existing menu items
        if (existingMenuItems.Any())
        {
            context.MenuItems.RemoveRange(existingMenuItems);
            await context.SaveChangesAsync(cancellationToken);
            itemsDeleted = existingMenuItems.Count;
        }

        return new BulkDeleteMenuItemsResult(
            itemsDeleted,
            itemsNotFound,
            notFoundReasons.ToArray()
        );
    }
}
