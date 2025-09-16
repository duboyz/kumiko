using System.Linq.Expressions;
using BackendApi.Entities;

namespace BackendApi.Repositories;

public interface ITextSectionRepository : IRepository<TextSection>
{
    Task<IEnumerable<TextSection>> FindWithWebsiteAsync(Expression<Func<TextSection, bool>> predicate);
}