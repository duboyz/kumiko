using System.Linq.Expressions;
using BackendApi.Entities;

namespace BackendApi.Repositories;

public interface IHeroSectionRepository : IRepository<HeroSection>
{
    Task<IEnumerable<HeroSection>> FindWithWebsiteAsync(Expression<Func<HeroSection, bool>> predicate);
}