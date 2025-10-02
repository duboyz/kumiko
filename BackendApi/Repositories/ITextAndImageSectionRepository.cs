using System.Linq.Expressions;
using BackendApi.Entities;

namespace BackendApi.Repositories;

public interface ITextAndImageSectionRepository : IRepository<TextAndImageSection>
{
    Task<IEnumerable<TextAndImageSection>> FindWithWebsiteAsync(Expression<Func<TextAndImageSection, bool>> predicate);
}
