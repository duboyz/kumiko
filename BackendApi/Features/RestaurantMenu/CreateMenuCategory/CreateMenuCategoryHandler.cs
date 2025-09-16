using BackendApi.Data;
using BackendApi.Entities;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.RestaurantMenu.CreateMenuCategory;

public class CreateMenuCategoryHandler(ApplicationDbContext context) : ICommandHandler<CreateMenuCategoryCommand, CreateMenuCategoryResult>
{
    public async Task<CreateMenuCategoryResult> Handle(CreateMenuCategoryCommand request, CancellationToken cancellationToken)
    {
        // Verify restaurant menu exists and user has access (add user authorization later)
        var restaurantMenu = await context.RestaurantMenus
            .FirstOrDefaultAsync(m => m.Id == request.RestaurantMenuId, cancellationToken);

        if (restaurantMenu == null)
        {
            throw new ArgumentException("Restaurant menu not found");
        }

        var category = new MenuCategory
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Description = request.Description,
            OrderIndex = request.OrderIndex,
            RestaurantMenuId = request.RestaurantMenuId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        context.MenuCategories.Add(category);
        await context.SaveChangesAsync(cancellationToken);

        return new CreateMenuCategoryResult(
            category.Id,
            category.Name,
            category.Description,
            category.OrderIndex,
            category.RestaurantMenuId
        );
    }
}
