using System.Linq.Expressions;
using BackendApi.Entities;

namespace BackendApi.Repositories;

public interface IWebsitePageRepository : IRepository<WebsitePage>
{
    Task<IEnumerable<WebsitePage>> FindWithSectionsAsync(Expression<Func<WebsitePage, bool>> predicate);
    Task<IEnumerable<WebsitePage>> FindWithWebsiteAsync(Expression<Func<WebsitePage, bool>> predicate);
    Task<bool> SaveChangesAsync();
}