using BackendApi.Data;
using BackendApi.Entities;

namespace BackendApi.Repositories;

public class WebsiteSectionRepository(ApplicationDbContext context) : Repository<WebsiteSection>(context), IWebsiteSectionRepository
{
    public async Task<bool> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }
}