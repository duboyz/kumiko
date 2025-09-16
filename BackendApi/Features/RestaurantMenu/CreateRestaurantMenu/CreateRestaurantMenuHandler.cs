using BackendApi.Data;
using BackendApi.Entities;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.RestaurantMenu.CreateRestaurantMenu;

public class CreateRestaurantMenuHandler(ApplicationDbContext context) : ICommandHandler<CreateRestaurantMenuCommand, CreateRestaurantMenuResult>
{
    public async Task<CreateRestaurantMenuResult> Handle(CreateRestaurantMenuCommand request, CancellationToken cancellationToken)
    {
        // Verify restaurant exists and user has access (add user authorization later)
        var restaurant = await context.Restaurants
            .FirstOrDefaultAsync(r => r.Id == request.RestaurantId, cancellationToken);

        if (restaurant == null)
        {
            throw new ArgumentException("Restaurant not found");
        }

        var menu = new Entities.RestaurantMenu
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Description = request.Description,
            RestaurantId = request.RestaurantId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        context.RestaurantMenus.Add(menu);
        await context.SaveChangesAsync(cancellationToken);

        return new CreateRestaurantMenuResult(
            menu.Id,
            menu.Name,
            menu.Description,
            menu.RestaurantId
        );
    }
}
