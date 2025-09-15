using BackendApi.Extensions;
using BackendApi.Repositories;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.Website.GetRestaurantWebsites;

public class GetRestaurantWebsitesHandler(
    IWebsiteRepository websiteRepository,
    IUserRestaurantRepository userRestaurantRepository,
    IHttpContextAccessor httpContextAccessor) : IQueryHandler<GetRestaurantWebsitesQuery, GetRestaurantWebsitesResult>
{
    public async Task<GetRestaurantWebsitesResult> Handle(GetRestaurantWebsitesQuery request, CancellationToken cancellationToken)
    {
        var userId = httpContextAccessor.GetCurrentUserId();

        // Get all restaurants the user has access to
        var userRestaurants = await userRestaurantRepository.FindAsync(ur => ur.UserId == userId);
        var restaurantIds = userRestaurants.Select(ur => ur.RestaurantId).ToList();

        // Filter by specific restaurant if provided
        if (request.EntityId.HasValue && request.EntityType == "Restaurant")
        {
            // Verify user has access to this specific restaurant
            if (restaurantIds.Contains(request.EntityId.Value))
            {
                restaurantIds = new List<Guid> { request.EntityId.Value };
            }
            else
            {
                // User doesn't have access to this restaurant
                return new GetRestaurantWebsitesResult(new List<WebsiteDto>());
            }
        }

        // Get all websites for the filtered restaurants
        var websites = await websiteRepository.FindAsync(w => restaurantIds.Contains(w.RestaurantId));

        var websiteDtos = websites
            .Where(w => w.Restaurant != null)
            .Select(w => new WebsiteDto(
                w.Id,
                w.Name,
                w.Subdomain,
                w.Description,
                w.IsPublished,
                w.RestaurantId,
                w.Restaurant.Name
            ))
            .ToList();

        return new GetRestaurantWebsitesResult(websiteDtos);
    }
}