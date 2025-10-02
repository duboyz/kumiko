using BackendApi.Extensions;
using BackendApi.Repositories;
using BackendApi.Shared.Contracts;

namespace BackendApi.Features.WebsitePage.DeleteWebsitePage;

public class DeleteWebsitePageHandler(
    IWebsiteRepository websiteRepository,
    IWebsitePageRepository websitePageRepository,
    IUserRestaurantRepository userRestaurantRepository,
    IUserHospitalityRepository userHospitalityRepository,
    IHttpContextAccessor httpContextAccessor) : ICommandHandler<DeleteWebsitePageCommand, DeleteWebsitePageResult>
{
    public async Task<DeleteWebsitePageResult> Handle(DeleteWebsitePageCommand request, CancellationToken cancellationToken)
    {
        var userId = httpContextAccessor.GetCurrentUserId();

        // Get the page
        var pages = await websitePageRepository.FindAsync(p => p.Id == request.PageId);
        var page = pages.FirstOrDefault();

        if (page == null)
        {
            throw new InvalidOperationException("Page not found");
        }

        // Get the website
        var websites = await websiteRepository.FindAsync(w => w.Id == page.WebsiteId);
        var website = websites.FirstOrDefault();

        if (website == null)
        {
            throw new InvalidOperationException("Website not found");
        }

        // Check user permissions
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

        await websitePageRepository.DeleteAsync(page.Id);

        return new DeleteWebsitePageResult(true);
    }
}
