using System.Linq.Expressions;
using BackendApi.Data;
using BackendApi.Entities;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Repositories;

public class TextSectionRepository(ApplicationDbContext context) : Repository<TextSection>(context), ITextSectionRepository
{
    public async Task<IEnumerable<TextSection>> FindWithWebsiteAsync(Expression<Func<TextSection, bool>> predicate)
    {
        return await _dbSet
            .Include(t => t.WebsiteSection)
                .ThenInclude(ws => ws.WebsitePage)
                    .ThenInclude(wp => wp.Website)
            .Where(predicate)
            .ToListAsync();
    }
}