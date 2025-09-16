using BackendApi.Data;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.RestaurantMenu.RemoveMenuItemFromCategory;

public class RemoveMenuItemFromCategoryHandler(ApplicationDbContext context) : ICommandHandler<RemoveMenuItemFromCategoryCommand, RemoveMenuItemFromCategoryResult>
{
    public async Task<RemoveMenuItemFromCategoryResult> Handle(RemoveMenuItemFromCategoryCommand request, CancellationToken cancellationToken)
    {
        var categoryItem = await context.MenuCategoryItems
            .FirstOrDefaultAsync(ci => ci.Id == request.CategoryItemId, cancellationToken);

        if (categoryItem == null)
        {
            throw new ArgumentException("Menu category item not found");
        }

        context.MenuCategoryItems.Remove(categoryItem);
        await context.SaveChangesAsync(cancellationToken);

        return new RemoveMenuItemFromCategoryResult(true);
    }
}
