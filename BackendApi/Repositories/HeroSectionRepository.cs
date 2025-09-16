using System.Linq.Expressions;
using BackendApi.Data;
using BackendApi.Entities;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Repositories;

public class HeroSectionRepository(ApplicationDbContext context) : Repository<HeroSection>(context), IHeroSectionRepository
{
    public async Task<IEnumerable<HeroSection>> FindWithWebsiteAsync(Expression<Func<HeroSection, bool>> predicate)
    {
        return await _dbSet
            .Include(h => h.WebsiteSection)
                .ThenInclude(ws => ws.WebsitePage)
                    .ThenInclude(wp => wp.Website)
            .Where(predicate)
            .ToListAsync();
    }
}