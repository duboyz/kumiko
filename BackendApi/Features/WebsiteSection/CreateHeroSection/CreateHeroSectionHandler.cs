using BackendApi.Entities;
using BackendApi.Extensions;
using BackendApi.Repositories;
using BackendApi.Shared.Contracts;

namespace BackendApi.Features.WebsiteSection.CreateHeroSection;

public class CreateHeroSectionHandler(
    IWebsitePageRepository websitePageRepository,
    IWebsiteSectionRepository websiteSectionRepository,
    IUserRestaurantRepository userRestaurantRepository,
    IUserHospitalityRepository userHospitalityRepository,
    IHttpContextAccessor httpContextAccessor) : ICommandHandler<CreateHeroSectionCommand, CreateHeroSectionResult>
{
    public async Task<CreateHeroSectionResult> Handle(CreateHeroSectionCommand request, CancellationToken cancellationToken)
    {
        var userId = httpContextAccessor.GetCurrentUserId();

        // Get the page and check access
        var pages = await websitePageRepository.FindWithWebsiteAsync(p => p.Id == request.WebsitePageId);
        var page = pages.FirstOrDefault();

        if (page == null)
        {
            throw new InvalidOperationException("Page not found");
        }

        // Check user permissions for this website
        var hasAccess = false;
        if (page.Website.RestaurantId.HasValue)
        {
            var userRestaurants = await userRestaurantRepository.FindAsync(ur => ur.UserId == userId && ur.RestaurantId == page.Website.RestaurantId.Value);
            hasAccess = userRestaurants.Any();
        }
        else if (page.Website.HospitalityId.HasValue)
        {
            var userHospitalities = await userHospitalityRepository.FindAsync(uh => uh.UserId == userId && uh.HospitalityId == page.Website.HospitalityId.Value);
            hasAccess = userHospitalities.Any();
        }

        if (!hasAccess)
        {
            throw new InvalidOperationException("Access denied");
        }

        var section = new Entities.WebsiteSection
        {
            WebsitePageId = request.WebsitePageId,
            SortOrder = request.SortOrder
        };

        var heroSection = new HeroSection
        {
            Title = request.Title,
            Description = request.Description,
            ImageUrl = request.ImageUrl,
            ImageAlt = request.ImageAlt,
            BackgroundColor = request.BackgroundColor,
            TextColor = request.TextColor,
            BackgroundOverlayColor = request.BackgroundOverlayColor,
            BackgroundImageUrl = request.BackgroundImageUrl,
            ButtonText = request.ButtonText,
            ButtonUrl = request.ButtonUrl,
            ButtonTextColor = request.ButtonTextColor,
            ButtonBackgroundColor = request.ButtonBackgroundColor,
            Type = request.Type,
            WebsiteSection = section
        };

        section.HeroSection = heroSection;

        await websiteSectionRepository.AddAsync(section);

        return new CreateHeroSectionResult(section.Id, heroSection.Id);
    }
}