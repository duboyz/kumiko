using BackendApi.Data;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.RestaurantMenu.UpdateMenuItem;

public class UpdateMenuItemHandler(ApplicationDbContext context) : ICommandHandler<UpdateMenuItemCommand, UpdateMenuItemResult>
{
    public async Task<UpdateMenuItemResult> Handle(UpdateMenuItemCommand request, CancellationToken cancellationToken)
    {
        var menuItem = await context.MenuItems
            .FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken);

        if (menuItem == null)
        {
            throw new ArgumentException("Menu item not found");
        }

        menuItem.Name = request.Name;
        menuItem.Description = request.Description;
        menuItem.Price = request.Price;
        menuItem.IsAvailable = request.IsAvailable;
        menuItem.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync(cancellationToken);

        return new UpdateMenuItemResult(
            menuItem.Id,
            menuItem.Name,
            menuItem.Description,
            menuItem.Price,
            menuItem.IsAvailable,
            menuItem.RestaurantMenuId
        );
    }
}
