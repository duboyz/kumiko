
using BackendApi.Data;
using BackendApi.Features.RestaurantMenu.DeleteMenuItem;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.RestaurantMenu.GetRestaurantMenuItems;

public class DeleteMenuItemsHandler(ApplicationDbContext context) : ICommandHandler<DeleteMenuItemCommand, DeleteMenuItemResult>
{
    public async Task<DeleteMenuItemResult> Handle(DeleteMenuItemCommand request, CancellationToken cancellationToken)
    {
        // Verify restaurant menu exists
        var menuItem = await context.MenuItems
            .FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken);

        if (menuItem == null)
        {
            throw new ArgumentException("Menu item not found");
        }

        context.MenuItems.Remove(menuItem);
        await context.SaveChangesAsync();

        return new DeleteMenuItemResult(true);
    }
}

