using System.Linq.Expressions;
using BackendApi.Entities;

namespace BackendApi.Repositories;

public interface IRestaurantMenuSectionRepository : IRepository<RestaurantMenuSection>
{
    Task<IEnumerable<RestaurantMenuSection>> FindWithWebsiteAsync(Expression<Func<RestaurantMenuSection, bool>> predicate);
}