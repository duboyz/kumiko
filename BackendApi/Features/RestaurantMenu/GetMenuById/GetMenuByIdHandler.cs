using BackendApi.Data;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.RestaurantMenu.GetMenuById;

public class GetMenuByIdHandler(ApplicationDbContext context) : IQueryHandler<GetMenuByIdQuery, GetMenuByIdResult>
{
    public async Task<GetMenuByIdResult> Handle(GetMenuByIdQuery request, CancellationToken cancellationToken)
    {
        var menu = await context.RestaurantMenus
            .Include(m => m.Categories)
                .ThenInclude(c => c.MenuCategoryItems)
                    .ThenInclude(mci => mci.MenuItem)
                        .ThenInclude(mi => mi!.Options.OrderBy(o => o.OrderIndex))
            .FirstOrDefaultAsync(m => m.Id == request.MenuId, cancellationToken);

        if (menu == null)
        {
            throw new InvalidOperationException($"Menu with ID '{request.MenuId}' not found");
        }

        var categories = menu.Categories
            .OrderBy(c => c.OrderIndex)
            .Select(category => new MenuByIdCategoryDto(
                category.Id,
                category.Name,
                category.Description,
                category.OrderIndex,
                category.MenuCategoryItems
                    .OrderBy(mci => mci.OrderIndex)
                    .Select(categoryItem => new MenuByIdCategoryItemDto(
                        categoryItem.Id,
                        categoryItem.OrderIndex,
                        categoryItem.MenuItem != null ? new MenuByIdItemDto(
                            categoryItem.MenuItem.Id,
                            categoryItem.MenuItem.Name,
                            categoryItem.MenuItem.Description,
                            categoryItem.MenuItem.Price,
                            categoryItem.MenuItem.HasOptions,
                            categoryItem.MenuItem.Options.Select(o => new MenuByIdItemOptionDto(
                                o.Id,
                                o.Name,
                                o.Description,
                                o.Price,
                                o.OrderIndex
                            )),
                            categoryItem.MenuItem.IsAvailable
                        ) : null
                    ))
                    .ToList()
            ))
            .ToList();

        return new GetMenuByIdResult(
            menu.Id,
            menu.Name,
            menu.Description,
            categories
        );
    }
}