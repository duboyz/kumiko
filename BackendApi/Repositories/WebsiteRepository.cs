using System.Linq.Expressions;
using BackendApi.Data;
using BackendApi.Entities;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Repositories;

public class WebsiteRepository(ApplicationDbContext context) : Repository<Website>(context), IWebsiteRepository
{
    public override async Task<IEnumerable<Website>> FindAsync(Expression<Func<Website, bool>> predicate)
    {
        return await _dbSet
            .Include(w => w.Restaurant)
            .Include(w => w.Hospitality)
            .Include(w => w.Pages)
                .ThenInclude(p => p.Sections)
                    .ThenInclude(s => s.HeroSection)
            .Include(w => w.Pages)
                .ThenInclude(p => p.Sections)
                    .ThenInclude(s => s.TextSection)
            .Include(w => w.Pages)
                .ThenInclude(p => p.Sections)
                    .ThenInclude(s => s.RestaurantMenuSection)
            .Where(predicate)
            .ToListAsync();
    }

    public async Task<bool> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }
}