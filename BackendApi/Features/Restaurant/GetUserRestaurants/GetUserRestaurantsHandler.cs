using BackendApi.Extensions;
using BackendApi.Models.Restaurant;
using BackendApi.Repositories;
using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Restaurant.GetUserRestaurants;

public class GetUserRestaurantsHandler(
    IUserRestaurantRepository userRestaurantRepository,
    IHttpContextAccessor httpContextAccessor) : IQueryHandler<GetUserRestaurantsQuery, GetUserRestaurantsResult>
{
    public async Task<GetUserRestaurantsResult> Handle(GetUserRestaurantsQuery request, CancellationToken cancellationToken)
    {
        var userId = httpContextAccessor.GetCurrentUserId();

        var userRestaurants = await userRestaurantRepository.FindAsync(ur => ur.UserId == userId);

        // Filter by roles if specified
        if (request.Roles != null && request.Roles.Count > 0)
        {
            userRestaurants = userRestaurants.Where(ur => request.Roles.Contains(ur.Role));
        }

        var restaurants = userRestaurants
            .Where(ur => ur.Restaurant != null) // Filter out null restaurants
            .Select(ur => new UserRestaurantDto(
                ur.Restaurant.ToBaseDto(),
                ur.Role.ToString()
            )).ToList();

        return new GetUserRestaurantsResult(restaurants);
    }
}