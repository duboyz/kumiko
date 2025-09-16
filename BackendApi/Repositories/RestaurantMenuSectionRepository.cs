using System.Linq.Expressions;
using BackendApi.Data;
using BackendApi.Entities;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Repositories;

public class RestaurantMenuSectionRepository(ApplicationDbContext context) : Repository<RestaurantMenuSection>(context), IRestaurantMenuSectionRepository
{
    public async Task<IEnumerable<RestaurantMenuSection>> FindWithWebsiteAsync(Expression<Func<RestaurantMenuSection, bool>> predicate)
    {
        return await _dbSet
            .Include(rms => rms.WebsiteSection)
                .ThenInclude(ws => ws.WebsitePage)
                    .ThenInclude(wp => wp.Website)
            .Include(rms => rms.RestaurantMenu)
                .ThenInclude(rm => rm.Categories)
                    .ThenInclude(c => c.MenuCategoryItems)
                        .ThenInclude(mci => mci.MenuItem)
            .Where(predicate)
            .ToListAsync();
    }
}