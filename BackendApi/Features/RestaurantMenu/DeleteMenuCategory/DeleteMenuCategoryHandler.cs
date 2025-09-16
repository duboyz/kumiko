using BackendApi.Data;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.RestaurantMenu.DeleteMenuCategory;

public class DeleteMenuCategoryHandler(ApplicationDbContext context) : ICommandHandler<DeleteMenuCategoryCommand, DeleteMenuCategoryResult>
{
    public async Task<DeleteMenuCategoryResult> Handle(DeleteMenuCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await context.MenuCategories
            .Include(c => c.MenuCategoryItems)
            .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);

        if (category == null)
        {
            throw new ArgumentException("Menu category not found");
        }

        // Remove all MenuCategoryItems first (cascade delete should handle this, but being explicit)
        context.MenuCategoryItems.RemoveRange(category.MenuCategoryItems);

        // Remove the category
        context.MenuCategories.Remove(category);

        await context.SaveChangesAsync(cancellationToken);

        return new DeleteMenuCategoryResult(true);
    }
}
