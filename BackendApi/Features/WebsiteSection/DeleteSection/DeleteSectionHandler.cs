using BackendApi.Extensions;
using BackendApi.Entities;
using BackendApi.Repositories;
using BackendApi.Shared.Contracts;

namespace BackendApi.Features.WebsiteSection.DeleteSection;

public class DeleteSectionHandler(
    IWebsiteSectionRepository websiteSectionRepository,
    IWebsitePageRepository websitePageRepository,
    IUserRestaurantRepository userRestaurantRepository,
    IUserHospitalityRepository userHospitalityRepository,
    IHttpContextAccessor httpContextAccessor) : ICommandHandler<DeleteSectionCommand, DeleteSectionResult>
{
    public async Task<DeleteSectionResult> Handle(DeleteSectionCommand request, CancellationToken cancellationToken)
    {
        var userId = httpContextAccessor.GetCurrentUserId();

        // Get the section to verify it exists and get the website for authorization
        var section = await websiteSectionRepository.GetByIdAsync(request.SectionId);
        if (section == null)
        {
            throw new InvalidOperationException("Section not found");
        }

        // Get the page and check access
        var pages = await websitePageRepository.FindWithWebsiteAsync(p => p.Id == section.WebsitePageId);
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

        // Delete the section
        await websiteSectionRepository.DeleteAsync(request.SectionId);

        return new DeleteSectionResult(true);
    }
}