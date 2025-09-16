using System.Linq.Expressions;
using BackendApi.Data;
using BackendApi.Entities;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Repositories;

public class WebsitePageRepository(ApplicationDbContext context) : Repository<WebsitePage>(context), IWebsitePageRepository
{
    public async Task<IEnumerable<WebsitePage>> FindWithSectionsAsync(Expression<Func<WebsitePage, bool>> predicate)
    {
        return await _dbSet
            .Include(p => p.Sections)
                .ThenInclude(s => s.HeroSection)
            .Include(p => p.Sections)
                .ThenInclude(s => s.TextSection)
            .Include(p => p.Sections)
                .ThenInclude(s => s.RestaurantMenuSection)
            .Where(predicate)
            .OrderBy(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<WebsitePage>> FindWithWebsiteAsync(Expression<Func<WebsitePage, bool>> predicate)
    {
        return await _dbSet
            .Include(p => p.Website)
            .Where(predicate)
            .ToListAsync();
    }


    public async Task<bool> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }
}