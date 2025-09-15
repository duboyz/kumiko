using Microsoft.EntityFrameworkCore;
using BackendApi.Data;
using BackendApi.Entities;

namespace BackendApi.Repositories.UserRepository;

public interface IUserRepository : IRepository<User>
{
    Task<Entities.User?> GetByEmailAsync(string email);
    Task<bool> EmailExistsAsync(string email);
    Task<Entities.User?> GetByRefreshTokenAsync(string refreshToken);
}
public class UserRepository(ApplicationDbContext context) : Repository<User>(context), IUserRepository
{
    public async Task<Entities.User?> GetByEmailAsync(string email)
    {
        return await _dbSet.FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<bool> EmailExistsAsync(string email)
    {
        return await _dbSet.AnyAsync(u => u.Email == email);
    }

    public async Task<Entities.User?> GetByRefreshTokenAsync(string refreshToken)
    {
        return await _dbSet.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);
    }
}