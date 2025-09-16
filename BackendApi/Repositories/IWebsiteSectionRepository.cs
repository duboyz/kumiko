using BackendApi.Entities;

namespace BackendApi.Repositories;

public interface IWebsiteSectionRepository : IRepository<WebsiteSection>
{
    Task<bool> SaveChangesAsync();
}