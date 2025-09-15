using BackendApi.Entities;

namespace BackendApi.Repositories;

public interface IWebsiteRepository : IRepository<Website>
{
    Task<bool> SaveChangesAsync();
}