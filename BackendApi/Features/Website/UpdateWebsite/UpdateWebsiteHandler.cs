using BackendApi.Extensions;
using BackendApi.Repositories;
using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Website.UpdateWebsite;

public class UpdateWebsiteHandler(
    IWebsiteRepository websiteRepository,
    IUserRestaurantRepository userRestaurantRepository,
    IUserHospitalityRepository userHospitalityRepository,
    IHttpContextAccessor httpContextAccessor) : ICommandHandler<UpdateWebsiteCommand, UpdateWebsiteResult>
{
    public async Task<UpdateWebsiteResult> Handle(UpdateWebsiteCommand request, CancellationToken cancellationToken)
    {
        var userId = httpContextAccessor.GetCurrentUserId();

        // Get the website
        var websites = await websiteRepository.FindAsync(w => w.Id == request.WebsiteId);
        var website = websites.FirstOrDefault();

        if (website == null)
        {
            throw new InvalidOperationException("Website not found");
        }

        // Check user permissions for this website
        var hasAccess = false;
        if (website.RestaurantId.HasValue)
        {
            var userRestaurants = await userRestaurantRepository.FindAsync(ur => ur.UserId == userId && ur.RestaurantId == website.RestaurantId.Value);
            hasAccess = userRestaurants.Any();
        }
        else if (website.HospitalityId.HasValue)
        {
            var userHospitalities = await userHospitalityRepository.FindAsync(uh => uh.UserId == userId && uh.HospitalityId == website.HospitalityId.Value);
            hasAccess = userHospitalities.Any();
        }

        if (!hasAccess)
        {
            throw new InvalidOperationException("Access denied");
        }

        // Update the website properties
        if (!string.IsNullOrEmpty(request.Name))
        {
            website.Name = request.Name;
        }

        if (request.Description is not null)
        {
            website.Description = request.Description;
        }

        if (request.IsPublished.HasValue)
        {
            website.IsPublished = request.IsPublished.Value;
        }

        await websiteRepository.UpdateAsync(website);

        return new UpdateWebsiteResult(website.Id, website.IsPublished);
    }
}