using BackendApi.Data;
using BackendApi.Entities;

namespace BackendApi.Repositories;

public interface IRestaurantRepository : IRepository<Restaurant> { }

public class RestaurantRepository(ApplicationDbContext context) : Repository<Restaurant>(context), IRestaurantRepository { }