using BackendApi.Data;
using BackendApi.Entities;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.RestaurantMenu.AddMenuItemAdditionalOption;

public class AddMenuItemAdditionalOptionHandler(ApplicationDbContext context)
    : ICommandHandler<AddMenuItemAdditionalOptionCommand, AddMenuItemAdditionalOptionResult>
{
    public async Task<AddMenuItemAdditionalOptionResult> Handle(
        AddMenuItemAdditionalOptionCommand request,
        CancellationToken cancellationToken)
    {
        // Verify menu item exists
        var menuItem = await context.MenuItems
            .FirstOrDefaultAsync(m => m.Id == request.MenuItemId, cancellationToken);

        if (menuItem == null)
        {
            throw new ArgumentException("Menu item not found");
        }

        var additionalOption = new MenuItemAdditionalOption
        {
            Id = Guid.NewGuid(),
            MenuItemId = request.MenuItemId,
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            OrderIndex = request.OrderIndex,
            IsAvailable = request.IsAvailable,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        context.MenuItemAdditionalOptions.Add(additionalOption);
        await context.SaveChangesAsync(cancellationToken);

        return new AddMenuItemAdditionalOptionResult(
            additionalOption.Id,
            additionalOption.MenuItemId,
            additionalOption.Name,
            additionalOption.Description,
            additionalOption.Price,
            additionalOption.OrderIndex,
            additionalOption.IsAvailable
        );
    }
}

