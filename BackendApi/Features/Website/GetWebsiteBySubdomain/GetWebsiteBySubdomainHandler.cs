using BackendApi.Entities;
using BackendApi.Repositories;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.Website.GetWebsiteBySubdomain;

public class GetWebsiteBySubdomainHandler(IWebsiteRepository websiteRepository) : IQueryHandler<GetWebsiteBySubdomainQuery, GetWebsiteBySubdomainResult>
{
    public async Task<GetWebsiteBySubdomainResult> Handle(GetWebsiteBySubdomainQuery request, CancellationToken cancellationToken)
    {
        var websites = await websiteRepository.FindAsync(w => w.Subdomain == request.Subdomain);
        var website = websites.FirstOrDefault();

        if (website == null)
        {
            throw new InvalidOperationException($"Website with subdomain '{request.Subdomain}' not found");
        }

        // Get pages with sections
        var pages = website.Pages
            .OrderBy(p => p.Title)
            .Select(page => new WebsitePageDto(
                page.Id,
                page.Title,
                page.Slug,
                page.Sections
                    .OrderBy(s => s.SortOrder)
                    .Select(section => new WebsiteSectionDto(
                        section.Id,
                        section.SortOrder,
                        section.HeroSection != null ? new HeroSectionDto(
                            section.HeroSection.Id,
                            section.HeroSection.Title,
                            section.HeroSection.Description,
                            section.HeroSection.ImageUrl,
                            section.HeroSection.ImageAlt,
                            section.HeroSection.BackgroundColor,
                            section.HeroSection.TextColor,
                            section.HeroSection.BackgroundOverlayColor,
                            section.HeroSection.BackgroundImageUrl,
                            section.HeroSection.ButtonText,
                            section.HeroSection.ButtonUrl,
                            section.HeroSection.ButtonTextColor,
                            section.HeroSection.ButtonBackgroundColor,
                            section.HeroSection.Type.ToString()
                        ) : null,
                        section.TextSection != null ? new TextSectionDto(
                            section.TextSection.Id,
                            section.TextSection.Title,
                            section.TextSection.Text,
                            section.TextSection.AlignText.ToString(),
                            section.TextSection.TextColor
                        ) : null,
                        section.RestaurantMenuSection != null ? new RestaurantMenuSectionDto(
                            section.RestaurantMenuSection.Id,
                            section.RestaurantMenuSection.RestaurantMenuId,
                            section.RestaurantMenuSection.AllowOrdering
                        ) : null
                    ))
                    .ToList()
            ))
            .ToList();

        return new GetWebsiteBySubdomainResult(
            website.Id,
            website.Name,
            website.Subdomain,
            website.Description,
            website.IsPublished,
            website.Type.ToString(),
            website.RestaurantId,
            website.Restaurant?.Name,
            pages
        );
    }
}