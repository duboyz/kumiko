using BackendApi.Data;
using BackendApi.Entities;

namespace BackendApi.Repositories;

public class HospitalityRepository(ApplicationDbContext context) : Repository<Hospitality>(context), IHospitalityRepository
{
    public async Task<bool> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }
}