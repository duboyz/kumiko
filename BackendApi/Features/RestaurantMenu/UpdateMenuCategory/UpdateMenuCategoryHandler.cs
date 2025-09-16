using BackendApi.Data;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.RestaurantMenu.UpdateMenuCategory;

public class UpdateMenuCategoryHandler(ApplicationDbContext context) : ICommandHandler<UpdateMenuCategoryCommand, UpdateMenuCategoryResult>
{
    public async Task<UpdateMenuCategoryResult> Handle(UpdateMenuCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await context.MenuCategories
            .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);

        if (category == null)
        {
            throw new ArgumentException("Menu category not found");
        }

        category.Name = request.Name;
        category.Description = request.Description;
        category.OrderIndex = request.OrderIndex;
        category.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync(cancellationToken);

        return new UpdateMenuCategoryResult(
            category.Id,
            category.Name,
            category.Description,
            category.OrderIndex,
            category.RestaurantMenuId
        );
    }
}
