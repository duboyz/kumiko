using BackendApi.Data;
using BackendApi.Entities;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.RestaurantMenu.UpdateMenuItem;

public class UpdateMenuItemHandler(ApplicationDbContext context) : ICommandHandler<UpdateMenuItemCommand, UpdateMenuItemResult>
{
    public async Task<UpdateMenuItemResult> Handle(UpdateMenuItemCommand request, CancellationToken cancellationToken)
    {
        var menuItem = await context.MenuItems
            .Include(i => i.Options)
            .Include(i => i.Allergens)
            .FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken);

        if (menuItem == null)
        {
            throw new ArgumentException("Menu item not found");
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

        menuItem.Name = request.Name;
        menuItem.Description = request.Description;
        menuItem.Price = request.Price;
        menuItem.HasOptions = request.HasOptions;
        menuItem.IsAvailable = request.IsAvailable;
        menuItem.UpdatedAt = DateTime.UtcNow;

        // Handle options update - clear and rebuild to avoid tracking issues
        if (request.HasOptions && request.Options != null)
        {
            // Remove all existing options
            if (menuItem.Options.Any())
            {
                context.MenuItemOptions.RemoveRange(menuItem.Options.ToList());
                await context.SaveChangesAsync(cancellationToken);
            }

            // Add all options from request
            foreach (var optionDto in request.Options)
            {
                var newOption = new MenuItemOption
                {
                    Name = optionDto.Name,
                    Description = optionDto.Description,
                    Price = optionDto.Price,
                    OrderIndex = optionDto.OrderIndex,
                    MenuItemId = menuItem.Id,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                context.MenuItemOptions.Add(newOption);
            }
        }
        else if (!request.HasOptions)
        {
            // Remove all options if item no longer has options
            if (menuItem.Options.Any())
            {
                context.MenuItemOptions.RemoveRange(menuItem.Options.ToList());
            }
        }

        // Handle allergens update
        if (request.AllergenIds != null)
        {
            // Remove existing allergens that aren't in the update
            var allergensToRemove = menuItem.Allergens
                .Where(a => !request.AllergenIds.Contains(a.AllergenId))
                .ToList();

            foreach (var allergen in allergensToRemove)
            {
                context.MenuItemAllergens.Remove(allergen);
            }

            // Add new allergens
            var existingAllergenIds = menuItem.Allergens.Select(a => a.AllergenId).ToList();
            var allergensToAdd = request.AllergenIds
                .Where(id => !existingAllergenIds.Contains(id))
                .ToList();

            foreach (var allergenId in allergensToAdd)
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

        return new UpdateMenuItemResult(
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
