using System.Linq.Expressions;
using BackendApi.Data;
using BackendApi.Entities;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Repositories;

public class UserHospitalityRepository : Repository<UserHospitality>, IUserHospitalityRepository
{
    public UserHospitalityRepository(ApplicationDbContext context) : base(context)
    {
    }

    public override async Task<IEnumerable<UserHospitality>> FindAsync(Expression<Func<UserHospitality, bool>> predicate)
    {
        return await _dbSet
            .Include(uh => uh.Hospitality)
            .Where(predicate)
            .ToListAsync();
    }
}