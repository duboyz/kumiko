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

        // Add additional options if provided
        if (request.AdditionalOptions != null)
        {
            foreach (var additionalOptionDto in request.AdditionalOptions)
            {
                var additionalOption = new MenuItemAdditionalOption
                {
                    Id = Guid.NewGuid(),
                    Name = additionalOptionDto.Name,
                    Description = additionalOptionDto.Description,
                    Price = additionalOptionDto.Price,
                    OrderIndex = additionalOptionDto.OrderIndex,
                    IsAvailable = additionalOptionDto.IsAvailable,
                    MenuItemId = menuItem.Id,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                menuItem.AdditionalOptions.Add(additionalOption);
            }
        }

        context.MenuItems.Add(menuItem);

        // Add allergens if provided
        if (request.AllergenIds != null && request.AllergenIds.Count > 0)
        {
            foreach (var allergenId in request.AllergenIds)
            {
                var allergen = await context.Allergens.FindAsync([allergenId], cancellationToken);
                if (allergen != null)
                {
                    var menuItemAllergen = new MenuItemAllergen
                    {
                        Id = Guid.NewGuid(),
                        MenuItemId = menuItem.Id,
                        AllergenId = allergenId,
                        CreatedAt = DateTime.UtcNow
                    };
                    context.MenuItemAllergens.Add(menuItemAllergen);
                }
            }
        }

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
