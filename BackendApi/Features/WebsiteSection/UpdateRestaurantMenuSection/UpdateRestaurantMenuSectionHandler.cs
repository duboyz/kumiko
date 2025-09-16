using BackendApi.Extensions;
using BackendApi.Repositories;
using BackendApi.Shared.Contracts;

namespace BackendApi.Features.WebsiteSection.UpdateRestaurantMenuSection;

public class UpdateRestaurantMenuSectionHandler(
    IRestaurantMenuSectionRepository restaurantMenuSectionRepository,
    IUserRestaurantRepository userRestaurantRepository,
    IUserHospitalityRepository userHospitalityRepository,
    IHttpContextAccessor httpContextAccessor) : ICommandHandler<UpdateRestaurantMenuSectionCommand, UpdateRestaurantMenuSectionResult>
{
    public async Task<UpdateRestaurantMenuSectionResult> Handle(UpdateRestaurantMenuSectionCommand request, CancellationToken cancellationToken)
    {
        var userId = httpContextAccessor.GetCurrentUserId();

        // Get the restaurant menu section with related data
        var restaurantMenuSections = await restaurantMenuSectionRepository.FindWithWebsiteAsync(rms => rms.Id == request.RestaurantMenuSectionId);
        var restaurantMenuSection = restaurantMenuSections.FirstOrDefault();

        if (restaurantMenuSection == null)
        {
            throw new InvalidOperationException("Restaurant menu section not found");
        }

        // Check user permissions for this website
        var hasAccess = false;
        if (restaurantMenuSection.WebsiteSection.WebsitePage.Website.RestaurantId.HasValue)
        {
            var userRestaurants = await userRestaurantRepository.FindAsync(ur => ur.UserId == userId && ur.RestaurantId == restaurantMenuSection.WebsiteSection.WebsitePage.Website.RestaurantId.Value);
            hasAccess = userRestaurants.Any();
        }
        else if (restaurantMenuSection.WebsiteSection.WebsitePage.Website.HospitalityId.HasValue)
        {
            var userHospitalities = await userHospitalityRepository.FindAsync(uh => uh.UserId == userId && uh.HospitalityId == restaurantMenuSection.WebsiteSection.WebsitePage.Website.HospitalityId.Value);
            hasAccess = userHospitalities.Any();
        }

        if (!hasAccess)
        {
            throw new InvalidOperationException("Access denied");
        }

        // Update the restaurant menu section
        restaurantMenuSection.RestaurantMenuId = request.RestaurantMenuId;
        restaurantMenuSection.AllowOrdering = request.AllowOrdering;

        await restaurantMenuSectionRepository.UpdateAsync(restaurantMenuSection);

        return new UpdateRestaurantMenuSectionResult(restaurantMenuSection.Id);
    }
}