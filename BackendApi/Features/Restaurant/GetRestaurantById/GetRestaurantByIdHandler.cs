using BackendApi.Models.Restaurant;
using BackendApi.Repositories;
using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Restaurant.GetRestaurantById;

public class GetRestaurantByIdHandler(IRestaurantRepository restaurantRepository) : IQueryHandler<GetRestaurantByIdQuery, RestaurantBaseDto>
{
    public async Task<RestaurantBaseDto> Handle(GetRestaurantByIdQuery request, CancellationToken cancellationToken)
    {
        var restaurant = await restaurantRepository.RequiredGetByIdAsync(request.Id);
        return restaurant.ToBaseDto();
    }
}