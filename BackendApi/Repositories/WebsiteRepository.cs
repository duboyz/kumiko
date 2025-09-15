using BackendApi.Data;
using BackendApi.Entities;

namespace BackendApi.Repositories;

public class WebsiteRepository(ApplicationDbContext context) : Repository<Website>(context), IWebsiteRepository
{
    public async Task<bool> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }
}