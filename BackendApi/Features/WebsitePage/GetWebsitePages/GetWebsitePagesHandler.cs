using BackendApi.Extensions;
using BackendApi.Repositories;
using BackendApi.Shared.Contracts;

namespace BackendApi.Features.WebsitePage.GetWebsitePages;

public class GetWebsitePagesHandler(
    IWebsiteRepository websiteRepository,
    IWebsitePageRepository websitePageRepository,
    IUserRestaurantRepository userRestaurantRepository,
    IUserHospitalityRepository userHospitalityRepository,
    IHttpContextAccessor httpContextAccessor) : IQueryHandler<GetWebsitePagesQuery, GetWebsitePagesResult>
{
    public async Task<GetWebsitePagesResult> Handle(GetWebsitePagesQuery request, CancellationToken cancellationToken)
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

        var pages = await websitePageRepository.FindWithSectionsAsync(p => p.WebsiteId == request.WebsiteId);

        var pageDtos = pages.Select(p => new WebsitePageDetailsDto(
            p.Id,
            p.Slug,
            p.Title,
            p.SeoTitle,
            p.SeoDescription,
            p.SeoKeywords,
            p.Subdomain,
            p.WebsiteId,
            p.Sections.OrderBy(s => s.SortOrder).Select(s => new WebsitePageSectionDto(
                s.Id,
                s.SortOrder,
                s.WebsitePageId,
                s.HeroSection != null ? new WebsitePageHeroSectionDto(
                    s.HeroSection.Id,
                    s.HeroSection.Title,
                    s.HeroSection.Description,
                    s.HeroSection.ImageUrl,
                    s.HeroSection.ImageAlt,
                    s.HeroSection.BackgroundColor,
                    s.HeroSection.TextColor,
                    s.HeroSection.BackgroundOverlayColor,
                    s.HeroSection.BackgroundImageUrl,
                    s.HeroSection.ButtonText,
                    s.HeroSection.ButtonUrl,
                    s.HeroSection.ButtonTextColor,
                    s.HeroSection.ButtonBackgroundColor,
                    s.HeroSection.Type
                ) : null,
                s.TextSection != null ? new WebsitePageTextSectionDto(
                    s.TextSection.Id,
                    s.TextSection.Title,
                    s.TextSection.Text,
                    s.TextSection.AlignText,
                    s.TextSection.TextColor
                ) : null,
                s.RestaurantMenuSection != null ? new WebsitePageRestaurantMenuSectionDto(
                    s.RestaurantMenuSection.Id,
                    s.RestaurantMenuSection.RestaurantMenuId,
                    s.RestaurantMenuSection.AllowOrdering
                ) : null
            )).ToList()
        )).ToList();

        return new GetWebsitePagesResult(pageDtos);
    }
}