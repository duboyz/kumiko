using BackendApi.Data;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.RestaurantMenu.ReorderMenuItems;

public class ReorderMenuItemsHandler(ApplicationDbContext context) : ICommandHandler<ReorderMenuItemsCommand, ReorderMenuItemsResult>
{
    public async Task<ReorderMenuItemsResult> Handle(ReorderMenuItemsCommand request, CancellationToken cancellationToken)
    {
        // Get all category items that need to be reordered
        var categoryItems = await context.MenuCategoryItems
            .Where(ci => ci.MenuCategoryId == request.CategoryId && request.CategoryItemIds.Contains(ci.Id))
            .ToListAsync(cancellationToken);

        if (categoryItems.Count != request.CategoryItemIds.Count)
        {
            throw new ArgumentException("Some menu category items were not found");
        }

        // Update order indices based on the new order
        for (int i = 0; i < request.CategoryItemIds.Count; i++)
        {
            var categoryItem = categoryItems.First(ci => ci.Id == request.CategoryItemIds[i]);
            categoryItem.OrderIndex = i;
            categoryItem.UpdatedAt = DateTime.UtcNow;
        }

        await context.SaveChangesAsync(cancellationToken);

        return new ReorderMenuItemsResult(true);
    }
}
