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

        var menuItem = new MenuItem
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            IsAvailable = request.IsAvailable,
            RestaurantMenuId = request.RestaurantMenuId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        context.MenuItems.Add(menuItem);
        await context.SaveChangesAsync(cancellationToken);

        return new CreateMenuItemResult(
            menuItem.Id,
            menuItem.Name,
            menuItem.Description,
            menuItem.Price,
            menuItem.IsAvailable,
            menuItem.RestaurantMenuId
        );
    }
}
