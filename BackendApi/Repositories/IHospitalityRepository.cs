using BackendApi.Entities;

namespace BackendApi.Repositories;

public interface IHospitalityRepository : IRepository<Hospitality>
{
    Task<bool> SaveChangesAsync();
}