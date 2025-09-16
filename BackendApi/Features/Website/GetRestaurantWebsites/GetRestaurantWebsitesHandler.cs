using BackendApi.Extensions;
using BackendApi.Repositories;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.Website.GetRestaurantWebsites;

public class GetRestaurantWebsitesHandler(
    IWebsiteRepository websiteRepository,
    IUserRestaurantRepository userRestaurantRepository,
    IUserHospitalityRepository userHospitalityRepository,
    IHttpContextAccessor httpContextAccessor) : IQueryHandler<GetRestaurantWebsitesQuery, GetRestaurantWebsitesResult>
{
    public async Task<GetRestaurantWebsitesResult> Handle(GetRestaurantWebsitesQuery request, CancellationToken cancellationToken)
    {
        var userId = httpContextAccessor.GetCurrentUserId();

        if (request.EntityType == "Hospitality")
        {
            // Handle hospitality websites
            var userHospitalities = await userHospitalityRepository.FindAsync(uh => uh.UserId == userId);
            var hospitalityIds = userHospitalities.Select(uh => uh.HospitalityId).ToList();

            // Filter by specific hospitality if provided
            if (request.EntityId.HasValue)
            {
                if (hospitalityIds.Contains(request.EntityId.Value))
                {
                    hospitalityIds = new List<Guid> { request.EntityId.Value };
                }
                else
                {
                    return new GetRestaurantWebsitesResult(new List<WebsiteDto>());
                }
            }

            // Get all websites for the filtered hospitalities
            var hospitalityWebsites = await websiteRepository.FindAsync(w => w.HospitalityId.HasValue && hospitalityIds.Contains(w.HospitalityId.Value));

            var hospitalityWebsiteDtos = hospitalityWebsites
                .Where(w => w.Hospitality != null && w.HospitalityId.HasValue)
                .Select(w => new WebsiteDto(
                    w.Id,
                    w.Name,
                    w.Subdomain,
                    w.Description,
                    w.IsPublished,
                    w.HospitalityId!.Value,
                    w.Hospitality!.Name
                ))
                .ToList();

            return new GetRestaurantWebsitesResult(hospitalityWebsiteDtos);
        }
        else
        {
            // Handle restaurant websites (default behavior)
            var userRestaurants = await userRestaurantRepository.FindAsync(ur => ur.UserId == userId);
            var restaurantIds = userRestaurants.Select(ur => ur.RestaurantId).ToList();

            // Filter by specific restaurant if provided
            if (request.EntityId.HasValue && request.EntityType == "Restaurant")
            {
                if (restaurantIds.Contains(request.EntityId.Value))
                {
                    restaurantIds = new List<Guid> { request.EntityId.Value };
                }
                else
                {
                    return new GetRestaurantWebsitesResult(new List<WebsiteDto>());
                }
            }

            // Get all websites for the filtered restaurants
            var restaurantWebsites = await websiteRepository.FindAsync(w => w.RestaurantId.HasValue && restaurantIds.Contains(w.RestaurantId.Value));

            var restaurantWebsiteDtos = restaurantWebsites
                .Where(w => w.Restaurant != null && w.RestaurantId.HasValue)
                .Select(w => new WebsiteDto(
                    w.Id,
                    w.Name,
                    w.Subdomain,
                    w.Description,
                    w.IsPublished,
                    w.RestaurantId!.Value,
                    w.Restaurant!.Name
                ))
                .ToList();

            return new GetRestaurantWebsitesResult(restaurantWebsiteDtos);
        }
    }
}