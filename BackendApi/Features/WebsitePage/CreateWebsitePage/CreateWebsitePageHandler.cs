using BackendApi.Entities;
using BackendApi.Extensions;
using BackendApi.Repositories;
using BackendApi.Shared.Contracts;

namespace BackendApi.Features.WebsitePage.CreateWebsitePage;

public class CreateWebsitePageHandler(
    IWebsiteRepository websiteRepository,
    IWebsitePageRepository websitePageRepository,
    IUserRestaurantRepository userRestaurantRepository,
    IUserHospitalityRepository userHospitalityRepository,
    IHttpContextAccessor httpContextAccessor) : ICommandHandler<CreateWebsitePageCommand, CreateWebsitePageResult>
{
    public async Task<CreateWebsitePageResult> Handle(CreateWebsitePageCommand request, CancellationToken cancellationToken)
    {
        var userId = httpContextAccessor.GetCurrentUserId();

        // Check if user has access to the website
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

        // Check if slug already exists for this website
        var existingPages = await websitePageRepository.FindAsync(p => p.WebsiteId == request.WebsiteId && p.Slug == request.Slug);
        if (existingPages.Any())
        {
            throw new InvalidOperationException("A page with this slug already exists");
        }

        var page = new Entities.WebsitePage
        {
            Slug = request.Slug,
            Title = request.Title,
            SeoTitle = request.SeoTitle,
            SeoDescription = request.SeoDescription,
            SeoKeywords = request.SeoKeywords,
            WebsiteId = request.WebsiteId,
            Subdomain = website.Subdomain
        };

        await websitePageRepository.AddAsync(page);

        return new CreateWebsitePageResult(page.Id);
    }
}