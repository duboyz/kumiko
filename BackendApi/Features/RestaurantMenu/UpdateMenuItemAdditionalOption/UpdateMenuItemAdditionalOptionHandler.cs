using BackendApi.Data;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.RestaurantMenu.UpdateMenuItemAdditionalOption;

public class UpdateMenuItemAdditionalOptionHandler(ApplicationDbContext context)
    : ICommandHandler<UpdateMenuItemAdditionalOptionCommand, UpdateMenuItemAdditionalOptionResult>
{
    public async Task<UpdateMenuItemAdditionalOptionResult> Handle(
        UpdateMenuItemAdditionalOptionCommand request,
        CancellationToken cancellationToken)
    {
        var additionalOption = await context.MenuItemAdditionalOptions
            .FirstOrDefaultAsync(ao => ao.Id == request.Id, cancellationToken);

        if (additionalOption == null)
        {
            throw new ArgumentException("Additional option not found");
        }

        additionalOption.Name = request.Name;
        additionalOption.Description = request.Description;
        additionalOption.Price = request.Price;
        additionalOption.OrderIndex = request.OrderIndex;
        additionalOption.IsAvailable = request.IsAvailable;
        additionalOption.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync(cancellationToken);

        return new UpdateMenuItemAdditionalOptionResult(
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

