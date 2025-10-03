using BackendApi.Data;
using BackendApi.Entities;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.RestaurantMenu.CreateMenuItem;

public class CreateMenuItemHandler(ApplicationDbContext context) : ICommandHandler<CreateMenuItemCommand, CreateMenuItemResult>
{
    public async Task<CreateMenuItemResult> Handle(CreateMenuItemCommand request, CancellationToken cancellationToken)
    {
        // Verify restaurant menu exists and user has access (add user authorization later)
        var restaurantMenu = await context.RestaurantMenus
            .FirstOrDefaultAsync(m => m.Id == request.RestaurantMenuId, cancellationToken);

        if (restaurantMenu == null)
        {
            throw new ArgumentException("Restaurant menu not found");
        }

        // Validate options logic
        if (request.HasOptions)
        {
            if (request.Options == null || request.Options.Count < 2)
            {
                throw new ArgumentException("Items with options must have at least 2 options");
            }
            if (request.Price != null)
            {
                throw new ArgumentException("Items with options should not have a base price");
            }
        }
        else
        {
            if (request.Price == null || request.Price <= 0)
            {
                throw new ArgumentException("Items without options must have a valid price");
            }
        }

        var menuItem = new MenuItem
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            HasOptions = request.HasOptions,
            IsAvailable = request.IsAvailable,
            RestaurantMenuId = request.RestaurantMenuId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        // Add options if provided
        if (request.HasOptions && request.Options != null)
        {
            foreach (var optionDto in request.Options)
            {
                var option = new MenuItemOption
                {
                    Id = Guid.NewGuid(),
                    Name = optionDto.Name,
                    Description = optionDto.Description,
                    Price = optionDto.Price,
                    OrderIndex = optionDto.OrderIndex,
                    MenuItemId = menuItem.Id,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                menuItem.Options.Add(option);
            }
        }

        context.MenuItems.Add(menuItem);
        await context.SaveChangesAsync(cancellationToken);

        return new CreateMenuItemResult(
            menuItem.Id,
            menuItem.Name,
            menuItem.Description,
            menuItem.Price,
            menuItem.HasOptions,
            menuItem.IsAvailable,
            menuItem.RestaurantMenuId
        );
    }
}
