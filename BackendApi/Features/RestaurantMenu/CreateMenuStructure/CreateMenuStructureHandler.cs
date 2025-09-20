using BackendApi.Data;
using BackendApi.Entities;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.RestaurantMenu.CreateMenuStructure;

public class CreateMenuStructureHandler(ApplicationDbContext context) : ICommandHandler<CreateMenuStructureCommand, CreateMenuStructureResult>
{
    public async Task<CreateMenuStructureResult> Handle(CreateMenuStructureCommand request, CancellationToken cancellationToken)
    {
        using var transaction = await context.Database.BeginTransactionAsync(cancellationToken);

        try
        {
            // Verify restaurant menu exists
            var restaurantMenu = await context.RestaurantMenus
                .FirstOrDefaultAsync(m => m.Id == request.RestaurantMenuId, cancellationToken);

            if (restaurantMenu == null)
            {
                throw new ArgumentException("Restaurant menu not found");
            }

            // Update menu name and description if provided
            if (!string.IsNullOrEmpty(request.MenuName))
            {
                restaurantMenu.Name = request.MenuName;
            }
            if (!string.IsNullOrEmpty(request.MenuDescription))
            {
                restaurantMenu.Description = request.MenuDescription;
            }

            var createdCategories = new List<CreatedCategoryResult>();
            var totalItemsCreated = 0;

            // Process each category
            foreach (var categoryCommand in request.Categories.OrderBy(c => c.OrderIndex))
            {
                // Create category
                var category = new MenuCategory
                {
                    Id = Guid.NewGuid(),
                    Name = categoryCommand.Name,
                    Description = categoryCommand.Description,
                    OrderIndex = categoryCommand.OrderIndex,
                    RestaurantMenuId = request.RestaurantMenuId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                context.MenuCategories.Add(category);

                var createdItems = new List<CreatedMenuItemResult>();

                // Process each item in the category
                foreach (var itemCommand in categoryCommand.Items.OrderBy(i => i.OrderIndex))
                {
                    // Create menu item
                    var menuItem = new MenuItem
                    {
                        Id = Guid.NewGuid(),
                        Name = itemCommand.Name,
                        Description = itemCommand.Description,
                        Price = itemCommand.Price,
                        IsAvailable = itemCommand.IsAvailable,
                        RestaurantMenuId = request.RestaurantMenuId,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };

                    context.MenuItems.Add(menuItem);

                    // Create category-item relationship
                    var categoryItem = new MenuCategoryItem
                    {
                        Id = Guid.NewGuid(),
                        MenuCategoryId = category.Id,
                        MenuItemId = menuItem.Id,
                        OrderIndex = itemCommand.OrderIndex,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };

                    context.MenuCategoryItems.Add(categoryItem);

                    createdItems.Add(new CreatedMenuItemResult
                    {
                        ItemId = menuItem.Id,
                        Name = menuItem.Name,
                        Description = menuItem.Description,
                        Price = menuItem.Price,
                        OrderIndex = itemCommand.OrderIndex,
                        IsAvailable = menuItem.IsAvailable
                    });

                    totalItemsCreated++;
                }

                createdCategories.Add(new CreatedCategoryResult
                {
                    CategoryId = category.Id,
                    Name = category.Name,
                    Description = category.Description,
                    OrderIndex = category.OrderIndex,
                    Items = createdItems
                });
            }

            // Save all changes
            await context.SaveChangesAsync(cancellationToken);
            await transaction.CommitAsync(cancellationToken);

            return new CreateMenuStructureResult
            {
                MenuId = restaurantMenu.Id,
                MenuName = restaurantMenu.Name,
                MenuDescription = restaurantMenu.Description,
                Categories = createdCategories,
                TotalItemsCreated = totalItemsCreated,
                TotalCategoriesCreated = createdCategories.Count
            };
        }
        catch
        {
            await transaction.RollbackAsync(cancellationToken);
            throw;
        }
    }
}
