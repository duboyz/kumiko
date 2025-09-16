using BackendApi.Extensions;
using BackendApi.Repositories;
using BackendApi.Shared.Contracts;
using BackendApi.Entities;

namespace BackendApi.Features.Website.CreateWebsite;

public class CreateWebsiteHandler(
    IWebsiteRepository websiteRepository,
    IUserRestaurantRepository userRestaurantRepository,
    IUserHospitalityRepository userHospitalityRepository,
    IHttpContextAccessor httpContextAccessor) : ICommandHandler<CreateWebsiteCommand, CreateWebsiteResult>
{
    public async Task<CreateWebsiteResult> Handle(CreateWebsiteCommand request, CancellationToken cancellationToken)
    {
        var userId = httpContextAccessor.GetCurrentUserId();

        // Check if subdomain is already taken
        var existingWebsite = await websiteRepository.FindAsync(w => w.Subdomain == request.Subdomain);
        if (existingWebsite.Any())
        {
            throw new InvalidOperationException("Subdomain is already taken");
        }

        var website = new Entities.Website
        {
            Name = request.Name,
            Subdomain = request.Subdomain,
            Description = request.Description,
            IsPublished = false
        };

        if (request.EntityType == "Restaurant")
        {
            // Handle restaurant website creation
            var entityId = request.EntityId ?? await GetUserDefaultRestaurantId(userId);

            var userRestaurants = await userRestaurantRepository.FindAsync(ur => ur.UserId == userId && ur.RestaurantId == entityId);
            var userRestaurant = userRestaurants.FirstOrDefault();

            if (userRestaurant?.Restaurant == null)
            {
                throw new InvalidOperationException("User must be associated with a restaurant to create a website");
            }

            website.RestaurantId = entityId;
            website.Type = WebsiteType.Restaurant;
        }
        else if (request.EntityType == "Hospitality")
        {
            // Handle hospitality website creation
            if (!request.EntityId.HasValue)
            {
                throw new InvalidOperationException("EntityId is required for hospitality websites");
            }

            var userHospitalities = await userHospitalityRepository.FindAsync(uh => uh.UserId == userId && uh.HospitalityId == request.EntityId);
            var userHospitality = userHospitalities.FirstOrDefault();

            if (userHospitality?.Hospitality == null)
            {
                throw new InvalidOperationException("User must be associated with a hospitality to create a website");
            }

            website.HospitalityId = request.EntityId.Value;
            website.Type = WebsiteType.Hospitality;
        }
        else
        {
            throw new InvalidOperationException($"Unsupported entity type: {request.EntityType}");
        }

        await websiteRepository.AddAsync(website);
        await websiteRepository.SaveChangesAsync();

        return new CreateWebsiteResult(website.Id);
    }

    private async Task<Guid> GetUserDefaultRestaurantId(Guid userId)
    {
        var userRestaurants = await userRestaurantRepository.FindAsync(ur => ur.UserId == userId);
        var userRestaurant = userRestaurants.FirstOrDefault();

        if (userRestaurant == null)
        {
            throw new InvalidOperationException("User must be associated with a restaurant to create a website");
        }

        return userRestaurant.RestaurantId;
    }
}