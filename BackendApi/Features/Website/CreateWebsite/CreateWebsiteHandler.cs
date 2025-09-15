using BackendApi.Extensions;
using BackendApi.Repositories;
using BackendApi.Shared.Contracts;
using BackendApi.Shared.Results;

namespace BackendApi.Features.Website.CreateWebsite;

public class CreateWebsiteHandler(
    IWebsiteRepository websiteRepository,
    IUserRestaurantRepository userRestaurantRepository,
    IHttpContextAccessor httpContextAccessor) : ICommandHandler<CreateWebsiteCommand, CreateWebsiteResult>
{
    public async Task<Result<CreateWebsiteResult>> Handle(CreateWebsiteCommand request, CancellationToken cancellationToken)
    {
        var userId = httpContextAccessor.GetCurrentUserId();

        // Get user's selected restaurant - for now we'll use the first one they manage
        var userRestaurants = await userRestaurantRepository.FindAsync(ur => ur.UserId == userId);
        var userRestaurant = userRestaurants.FirstOrDefault();

        if (userRestaurant?.Restaurant == null)
        {
            return Result<CreateWebsiteResult>.Failure("User must be associated with a restaurant to create a website");
        }

        // Check if subdomain is already taken
        var existingWebsite = await websiteRepository.FindAsync(w => w.Subdomain == request.Subdomain);
        if (existingWebsite.Any())
        {
            return Result<CreateWebsiteResult>.Failure("Subdomain is already taken");
        }

        var website = new Entities.Website
        {
            Name = request.Name,
            Subdomain = request.Subdomain,
            Description = request.Description,
            RestaurantId = userRestaurant.RestaurantId,
            IsPublished = false
        };

        await websiteRepository.AddAsync(website);
        await websiteRepository.SaveChangesAsync();

        return Result<CreateWebsiteResult>.Success(new CreateWebsiteResult(website.Id));
    }
}