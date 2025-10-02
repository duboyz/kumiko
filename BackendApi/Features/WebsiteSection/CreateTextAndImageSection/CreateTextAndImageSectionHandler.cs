using BackendApi.Entities;
using BackendApi.Extensions;
using BackendApi.Repositories;
using BackendApi.Shared.Contracts;

namespace BackendApi.Features.WebsiteSection.CreateTextAndImageSection;

public class CreateTextAndImageSectionHandler(
    IWebsitePageRepository websitePageRepository,
    IWebsiteSectionRepository websiteSectionRepository,
    IUserRestaurantRepository userRestaurantRepository,
    IUserHospitalityRepository userHospitalityRepository,
    IHttpContextAccessor httpContextAccessor) : ICommandHandler<CreateTextAndImageSectionCommand, CreateTextAndImageSectionResult>
{
    public async Task<CreateTextAndImageSectionResult> Handle(CreateTextAndImageSectionCommand request, CancellationToken cancellationToken)
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

        var textAndImageSection = new TextAndImageSection
        {
            Title = request.Title,
            Content = request.Content,
            ButtonText = request.ButtonText,
            ButtonUrl = request.ButtonUrl,
            ImageUrl = request.ImageUrl,
            ImageAlt = request.ImageAlt,
            TextColor = request.TextColor,
            ButtonColor = request.ButtonColor,
            ButtonTextColor = request.ButtonTextColor,
            Alignment = request.Alignment,
            ImageOnLeft = request.ImageOnLeft,
            WebsiteSection = section
        };

        section.TextAndImageSection = textAndImageSection;

        await websiteSectionRepository.AddAsync(section);

        return new CreateTextAndImageSectionResult(section.Id, textAndImageSection.Id);
    }
}
