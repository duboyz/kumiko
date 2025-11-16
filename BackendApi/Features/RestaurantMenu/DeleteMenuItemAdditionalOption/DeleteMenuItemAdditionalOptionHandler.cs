using BackendApi.Data;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.RestaurantMenu.DeleteMenuItemAdditionalOption;

public class DeleteMenuItemAdditionalOptionHandler(ApplicationDbContext context)
    : ICommandHandler<DeleteMenuItemAdditionalOptionCommand, DeleteMenuItemAdditionalOptionResult>
{
    public async Task<DeleteMenuItemAdditionalOptionResult> Handle(
        DeleteMenuItemAdditionalOptionCommand request,
        CancellationToken cancellationToken)
    {
        var additionalOption = await context.MenuItemAdditionalOptions
            .FirstOrDefaultAsync(ao => ao.Id == request.Id, cancellationToken);

        if (additionalOption == null)
        {
            throw new ArgumentException("Additional option not found");
        }

        context.MenuItemAdditionalOptions.Remove(additionalOption);
        await context.SaveChangesAsync(cancellationToken);

        return new DeleteMenuItemAdditionalOptionResult(true);
    }
}

