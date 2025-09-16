using BackendApi.Data;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.RestaurantMenu.ReorderCategories;

public class ReorderCategoriesHandler(ApplicationDbContext context) : ICommandHandler<ReorderCategoriesCommand, ReorderCategoriesResult>
{
    public async Task<ReorderCategoriesResult> Handle(ReorderCategoriesCommand request, CancellationToken cancellationToken)
    {
        // Get all categories that need to be reordered
        var categories = await context.MenuCategories
            .Where(c => request.CategoryIds.Contains(c.Id))
            .ToListAsync(cancellationToken);

        if (categories.Count != request.CategoryIds.Count)
        {
            throw new ArgumentException("Some categories were not found");
        }

        // Update order indices based on the new order
        for (int i = 0; i < request.CategoryIds.Count; i++)
        {
            var category = categories.First(c => c.Id == request.CategoryIds[i]);
            category.OrderIndex = i;
            category.UpdatedAt = DateTime.UtcNow;
        }

        await context.SaveChangesAsync(cancellationToken);

        return new ReorderCategoriesResult(true);
    }
}
