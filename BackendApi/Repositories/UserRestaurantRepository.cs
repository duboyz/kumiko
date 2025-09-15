using System.Linq.Expressions;
using BackendApi.Data;
using BackendApi.Entities;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Repositories;

public class UserRestaurantRepository : Repository<UserRestaurant>, IUserRestaurantRepository
{
    public UserRestaurantRepository(ApplicationDbContext context) : base(context)
    {
    }

    public override async Task<IEnumerable<UserRestaurant>> FindAsync(Expression<Func<UserRestaurant, bool>> predicate)
    {
        return await _dbSet
            .Include(ur => ur.Restaurant)
            .Where(predicate)
            .ToListAsync();
    }
}