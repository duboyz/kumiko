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
            // Verify restaurant exists
            var restaurant = await context.Restaurants
                .FirstOrDefaultAsync(r => r.Id == request.RestaurantId, cancellationToken);

            if (restaurant == null)
            {
                throw new ArgumentException("Restaurant not found");
            }

            // Create new restaurant menu
            var restaurantMenu = new Entities.RestaurantMenu
            {
                Id = Guid.NewGuid(),
                Name = request.MenuName,
                Description = request.MenuDescription,
                RestaurantId = request.RestaurantId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            context.RestaurantMenus.Add(restaurantMenu);
            await context.SaveChangesAsync(cancellationToken);

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
                    RestaurantMenuId = restaurantMenu.Id,
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
                        HasOptions = false, // Default to no options for menu structure creation
                        IsAvailable = itemCommand.IsAvailable,
                        RestaurantMenuId = restaurantMenu.Id,
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
                        Price = menuItem.Price ?? 0, // Use default 0 if null
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
