using BackendApi.Extensions;
using BackendApi.Repositories;
using BackendApi.Shared.Contracts;

namespace BackendApi.Features.WebsiteSection.UpdateHeroSection;

public class UpdateHeroSectionHandler(
    IHeroSectionRepository heroSectionRepository,
    IUserRestaurantRepository userRestaurantRepository,
    IUserHospitalityRepository userHospitalityRepository,
    IHttpContextAccessor httpContextAccessor) : ICommandHandler<UpdateHeroSectionCommand, UpdateHeroSectionResult>
{
    public async Task<UpdateHeroSectionResult> Handle(UpdateHeroSectionCommand request, CancellationToken cancellationToken)
    {
        var userId = httpContextAccessor.GetCurrentUserId();

        // Get the hero section with related entities
        var heroSections = await heroSectionRepository.FindWithWebsiteAsync(h => h.Id == request.HeroSectionId);
        var heroSection = heroSections.FirstOrDefault();

        if (heroSection == null)
        {
            throw new InvalidOperationException("Hero section not found");
        }

        // Check user permissions
        var hasAccess = false;
        var website = heroSection.WebsiteSection.WebsitePage.Website;

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

        // Update hero section properties
        heroSection.Title = request.Title;
        heroSection.Description = request.Description;
        heroSection.ImageUrl = request.ImageUrl;
        heroSection.ImageAlt = request.ImageAlt;
        heroSection.BackgroundColor = request.BackgroundColor;
        heroSection.TextColor = request.TextColor;
        heroSection.BackgroundOverlayColor = request.BackgroundOverlayColor;
        heroSection.BackgroundImageUrl = request.BackgroundImageUrl;
        heroSection.ButtonText = request.ButtonText;
        heroSection.ButtonUrl = request.ButtonUrl;
        heroSection.ButtonTextColor = request.ButtonTextColor;
        heroSection.ButtonBackgroundColor = request.ButtonBackgroundColor;
        heroSection.Type = request.Type;

        await heroSectionRepository.UpdateAsync(heroSection);

        return new UpdateHeroSectionResult(heroSection.Id);
    }
}