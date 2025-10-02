using BackendApi.Entities;
using BackendApi.Extensions;
using BackendApi.Repositories;
using BackendApi.Shared.Contracts;
using MediatR;
using BackendApi.Features.WebsiteSection.CreateHeroSection;
using BackendApi.Features.WebsiteSection.CreateTextSection;
using BackendApi.Features.WebsiteSection.CreateRestaurantMenuSection;
using System.Text.Json;

namespace BackendApi.Features.WebsitePage.CreateWebsitePage;

public class CreateWebsitePageHandler(
    IWebsiteRepository websiteRepository,
    IWebsitePageRepository websitePageRepository,
    IUserRestaurantRepository userRestaurantRepository,
    IUserHospitalityRepository userHospitalityRepository,
    IHttpContextAccessor httpContextAccessor,
    IMediator mediator) : ICommandHandler<CreateWebsitePageCommand, CreateWebsitePageResult>
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

        // Create sections from template if provided
        if (request.Sections != null && request.Sections.Any())
        {
            await CreateSectionsFromTemplate(page.Id, request.Sections, cancellationToken);
        }

        return new CreateWebsitePageResult(page.Id);
    }

    private async Task CreateSectionsFromTemplate(Guid pageId, List<CreatePageSectionCommand> sections, CancellationToken cancellationToken)
    {
        foreach (var section in sections.OrderBy(s => s.Order))
        {
            switch (section.Type.ToLowerInvariant())
            {
                case "hero":
                    await CreateHeroSectionFromConfig(pageId, section, cancellationToken);
                    break;
                case "text":
                    await CreateTextSectionFromConfig(pageId, section, cancellationToken);
                    break;
                case "menu":
                    await CreateMenuSectionFromConfig(pageId, section, cancellationToken);
                    break;
            }
        }
    }

    private async Task CreateHeroSectionFromConfig(Guid pageId, CreatePageSectionCommand section, CancellationToken cancellationToken)
    {
        var config = section.Config;

        var command = new CreateHeroSectionCommand(
            WebsitePageId: pageId,
            SortOrder: section.Order,
            Title: GetStringValue(config, "title") ?? "",
            Description: GetStringValue(config, "description") ?? "",
            ImageUrl: GetStringValue(config, "imageUrl"),
            ImageAlt: GetStringValue(config, "imageAlt"),
            BackgroundColor: GetStringValue(config, "backgroundColor"),
            TextColor: GetStringValue(config, "textColor"),
            BackgroundOverlayColor: GetStringValue(config, "backgroundOverlayColor"),
            BackgroundImageUrl: GetStringValue(config, "backgroundImageUrl"),
            ButtonText: GetStringValue(config, "buttonText"),
            ButtonUrl: GetStringValue(config, "buttonUrl"),
            ButtonTextColor: GetStringValue(config, "buttonTextColor"),
            ButtonBackgroundColor: GetStringValue(config, "buttonBackgroundColor"),
            Type: GetEnumValue<HeroSectionType>(config, "type", HeroSectionType.BackgroundImage)
        );

        await mediator.Send(command, cancellationToken);
    }

    private async Task CreateTextSectionFromConfig(Guid pageId, CreatePageSectionCommand section, CancellationToken cancellationToken)
    {
        var config = section.Config;

        var command = new CreateTextSectionCommand(
            WebsitePageId: pageId,
            SortOrder: section.Order,
            Title: GetStringValue(config, "title"),
            Text: GetStringValue(config, "text"),
            AlignText: GetEnumValue<TextAlignment>(config, "alignText", TextAlignment.Left),
            TextColor: GetStringValue(config, "textColor")
        );

        await mediator.Send(command, cancellationToken);
    }

    private async Task CreateMenuSectionFromConfig(Guid pageId, CreatePageSectionCommand section, CancellationToken cancellationToken)
    {
        var config = section.Config;

        // For menu sections, we need a valid RestaurantMenuId
        var menuIdString = GetStringValue(config, "menuId");
        if (string.IsNullOrEmpty(menuIdString) || !Guid.TryParse(menuIdString, out var menuId))
        {
            // Skip menu section if no valid menu ID is provided
            return;
        }

        var command = new CreateRestaurantMenuSectionCommand(
            WebsitePageId: pageId,
            SortOrder: section.Order,
            RestaurantMenuId: menuId,
            AllowOrdering: GetBoolValue(config, "allowOrdering", false)
        );

        await mediator.Send(command, cancellationToken);
    }

    private static string? GetStringValue(Dictionary<string, object> config, string key)
    {
        if (config.TryGetValue(key, out var value))
        {
            return value?.ToString();
        }
        return null;
    }

    private static bool GetBoolValue(Dictionary<string, object> config, string key, bool defaultValue = false)
    {
        if (config.TryGetValue(key, out var value))
        {
            if (value is bool boolValue)
                return boolValue;
            if (bool.TryParse(value?.ToString(), out var parsedBool))
                return parsedBool;
        }
        return defaultValue;
    }

    private static T GetEnumValue<T>(Dictionary<string, object> config, string key, T defaultValue) where T : struct, Enum
    {
        if (config.TryGetValue(key, out var value))
        {
            if (value is T enumValue)
                return enumValue;
            if (Enum.TryParse<T>(value?.ToString(), true, out var parsedEnum))
                return parsedEnum;
        }
        return defaultValue;
    }
}