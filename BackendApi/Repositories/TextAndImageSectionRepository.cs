using System.Linq.Expressions;
using BackendApi.Data;
using BackendApi.Entities;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Repositories;

public class TextAndImageSectionRepository(ApplicationDbContext context) : Repository<TextAndImageSection>(context), ITextAndImageSectionRepository
{
    public async Task<IEnumerable<TextAndImageSection>> FindWithWebsiteAsync(Expression<Func<TextAndImageSection, bool>> predicate)
    {
        return await _dbSet
            .Include(t => t.WebsiteSection)
                .ThenInclude(ws => ws.WebsitePage)
                    .ThenInclude(wp => wp.Website)
            .Where(predicate)
            .ToListAsync();
    }
}
