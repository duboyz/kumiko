using BackendApi.Data;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.RestaurantMenu.UpdateTitleAndDescription;

public class UpdateRestaurantMenuHandler(ApplicationDbContext context) : ICommandHandler<UpdateRestaurantMenuCommand, UpdateRestaurantMenuResult>
{
    public async Task<UpdateRestaurantMenuResult> Handle(UpdateRestaurantMenuCommand request, CancellationToken cancellationToken)
    {
        var menu = await context.RestaurantMenus
            .FirstOrDefaultAsync(m => m.Id == request.Id, cancellationToken);

        if (menu == null)
        {
            throw new ArgumentException("Restaurant menu not found");
        }

        menu.Name = request.Name;
        menu.Description = request.Description;
        menu.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync(cancellationToken);

        return new UpdateRestaurantMenuResult(
            menu.Id,
            menu.Name,
            menu.Description,
            menu.RestaurantId
        );
    }
}
