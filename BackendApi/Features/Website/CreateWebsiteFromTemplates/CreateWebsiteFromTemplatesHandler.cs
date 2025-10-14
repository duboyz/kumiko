using BackendApi.Entities;
using BackendApi.Extensions;
using BackendApi.Repositories;
using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Website.CreateWebsiteFromTemplates;

public class CreateWebsiteFromTemplatesHandler(
    IWebsiteRepository websiteRepository,
    IWebsitePageRepository websitePageRepository,
    IWebsiteSectionRepository websiteSectionRepository,
    IRestaurantRepository restaurantRepository,
    IUserRestaurantRepository userRestaurantRepository,
    IHttpContextAccessor httpContextAccessor) : ICommandHandler<CreateWebsiteFromTemplatesCommand, CreateWebsiteFromTemplatesResult>
{
    public async Task<CreateWebsiteFromTemplatesResult> Handle(CreateWebsiteFromTemplatesCommand request, CancellationToken cancellationToken)
    {
        var userId = httpContextAccessor.GetCurrentUserId();

        // Verify user has access to restaurant
        var userRestaurants = await userRestaurantRepository.FindAsync(ur => ur.UserId == userId && ur.RestaurantId == request.RestaurantId);
        if (!userRestaurants.Any())
        {
            throw new InvalidOperationException("Access denied to restaurant");
        }

        // Fetch restaurant data for prefilling
        var restaurants = await restaurantRepository.FindAsync(r => r.Id == request.RestaurantId);
        var restaurant = restaurants.FirstOrDefault();
        if (restaurant == null)
        {
            throw new InvalidOperationException("Restaurant not found");
        }

        // Note: Menu validation is not performed here as it's handled by the frontend
        // and the menu ID is provided from the onboarding flow

        // Check if subdomain is already taken
        var existingWebsites = await websiteRepository.FindAsync(w => w.Subdomain == request.Subdomain);
        if (existingWebsites.Any())
        {
            throw new InvalidOperationException("Subdomain is already taken");
        }

        // Create the website
        var website = new Entities.Website
        {
            Name = request.WebsiteName,
            Subdomain = request.Subdomain,
            Description = request.Description,
            RestaurantId = request.RestaurantId,
            Type = WebsiteType.Restaurant,
            IsPublished = false
        };

        await websiteRepository.AddAsync(website);

        // Create pages from templates
        var createdPages = new List<CreatedPageResult>();
        foreach (var pageTemplate in request.PageTemplates)
        {
            var page = await CreatePageFromTemplate(website, pageTemplate, restaurant, request.MenuId);
            createdPages.Add(new CreatedPageResult(
                page.Id,
                page.Title,
                page.Slug,
                pageTemplate.TemplateType.ToString()
            ));
        }

        return new CreateWebsiteFromTemplatesResult(
            website.Id,
            website.Name,
            website.Subdomain,
            createdPages
        );
    }

    private async Task<Entities.WebsitePage> CreatePageFromTemplate(
        Entities.Website website,
        PageTemplateRequest templateRequest,
        Entities.Restaurant restaurant,
        Guid? menuId)
    {
        // Get template defaults
        var (title, slug, seoTitle, seoDescription) = GetTemplateDefaults(templateRequest.TemplateType);

        // Use custom values if provided
        var finalTitle = templateRequest.CustomTitle ?? title;
        var finalSlug = templateRequest.CustomSlug ?? slug;

        // Create the page
        var page = new Entities.WebsitePage
        {
            Slug = finalSlug,
            Title = finalTitle,
            SeoTitle = seoTitle,
            SeoDescription = seoDescription,
            WebsiteId = website.Id,
            Subdomain = website.Subdomain
        };

        await websitePageRepository.AddAsync(page);

        // Create sections based on template
        await CreateTemplateSections(templateRequest.TemplateType, page.Id, restaurant, menuId);

        return page;
    }

    private (string Title, string Slug, string SeoTitle, string SeoDescription) GetTemplateDefaults(PageTemplate template)
    {
        return template switch
        {
            PageTemplate.FrontPage => (
                "Home",
                "home",
                "Welcome to Our Restaurant",
                "Experience exceptional dining with our carefully crafted menu and warm atmosphere"
            ),
            PageTemplate.MenuPage => (
                "Menu",
                "menu",
                "Our Menu",
                "Explore our delicious selection of dishes"
            ),
            PageTemplate.AboutPage => (
                "About Us",
                "about",
                "About Our Restaurant",
                "Learn more about our story and what makes us special"
            ),
            PageTemplate.ContactPage => (
                "Contact",
                "contact",
                "Contact Us",
                "Get in touch with us for reservations and inquiries"
            ),
            PageTemplate.Blank => (
                "New Page",
                "new-page",
                "",
                ""
            ),
            _ => throw new ArgumentException("Invalid template type")
        };
    }

    private async Task CreateTemplateSections(PageTemplate template, Guid pageId, Entities.Restaurant restaurant, Guid? menuId)
    {
        switch (template)
        {
            case PageTemplate.FrontPage:
                await CreateFrontPageSections(pageId, restaurant);
                break;
            case PageTemplate.MenuPage:
                await CreateMenuPageSections(pageId, menuId);
                break;
            case PageTemplate.AboutPage:
                await CreateAboutPageSections(pageId, restaurant);
                break;
            case PageTemplate.ContactPage:
                await CreateContactPageSections(pageId, restaurant);
                break;
            case PageTemplate.Blank:
                // No sections for blank page
                break;
        }
    }

    private async Task CreateFrontPageSections(Guid pageId, Entities.Restaurant restaurant)
    {
        // Hero Section
        var heroSection = new Entities.WebsiteSection
        {
            WebsitePageId = pageId,
            SortOrder = 0,
            HeroSection = new Entities.HeroSection
            {
                Title = $"Welcome to {restaurant.Name}",
                Description = restaurant.Description ?? "Experience exceptional dining with our carefully crafted menu and warm atmosphere",
                Type = Entities.HeroSectionType.BackgroundImage,
                BackgroundOverlayColor = "rgba(0, 0, 0, 0.4)",
                TextColor = "#ffffff",
                ButtonText = "View Menu",
                ButtonUrl = "/menu",
                ButtonTextColor = "#ffffff",
                ButtonBackgroundColor = "#ef4444"
            }
        };

        await websiteSectionRepository.AddAsync(heroSection);

        // Text Section
        var textSection = new Entities.WebsiteSection
        {
            WebsitePageId = pageId,
            SortOrder = 1,
            TextSection = new Entities.TextSection
            {
                Title = "Our Story",
                Text = restaurant.Description ?? "We are committed to bringing you the finest dining experience with carefully selected ingredients and expertly crafted dishes.",
                AlignText = Entities.TextAlignment.Center,
                TextColor = "#000000"
            }
        };

        await websiteSectionRepository.AddAsync(textSection);
    }

    private async Task CreateMenuPageSections(Guid pageId, Guid? menuId)
    {
        if (!menuId.HasValue)
        {
            throw new InvalidOperationException("MenuId is required for MenuPage template");
        }

        var menuSection = new Entities.WebsiteSection
        {
            WebsitePageId = pageId,
            SortOrder = 0,
            RestaurantMenuSection = new Entities.RestaurantMenuSection
            {
                RestaurantMenuId = menuId.Value,
                AllowOrdering = false
            }
        };

        await websiteSectionRepository.AddAsync(menuSection);
    }

    private async Task CreateAboutPageSections(Guid pageId, Entities.Restaurant restaurant)
    {
        // Hero Section
        var heroSection = new Entities.WebsiteSection
        {
            WebsitePageId = pageId,
            SortOrder = 0,
            HeroSection = new Entities.HeroSection
            {
                Title = "About Us",
                Description = $"Discover the story behind {restaurant.Name}",
                Type = Entities.HeroSectionType.ImageRight,
                BackgroundColor = "#ffffff",
                TextColor = "#1f2937"
            }
        };

        await websiteSectionRepository.AddAsync(heroSection);

        // Text Section
        var textSection = new Entities.WebsiteSection
        {
            WebsitePageId = pageId,
            SortOrder = 1,
            TextSection = new Entities.TextSection
            {
                Title = "Our Philosophy",
                Text = restaurant.Description ?? "We believe in using the finest ingredients and traditional cooking methods to create memorable dining experiences.",
                AlignText = Entities.TextAlignment.Left,
                TextColor = "#000000"
            }
        };

        await websiteSectionRepository.AddAsync(textSection);
    }

    private async Task CreateContactPageSections(Guid pageId, Entities.Restaurant restaurant)
    {
        // Build contact information text
        var contactText = $"We'd love to hear from you. Contact us for reservations, inquiries, or any questions you may have.\n\n";
        contactText += $"📍 {restaurant.Address}\n";
        contactText += $"🏙️ {restaurant.City}, {restaurant.State} {restaurant.Zip}\n";

        if (!string.IsNullOrEmpty(restaurant.BusinessHours))
        {
            contactText += $"\n🕒 Business Hours:\n{restaurant.BusinessHours}";
        }

        var textSection = new Entities.WebsiteSection
        {
            WebsitePageId = pageId,
            SortOrder = 0,
            TextSection = new Entities.TextSection
            {
                Title = "Get in Touch",
                Text = contactText,
                AlignText = Entities.TextAlignment.Left,
                TextColor = "#000000"
            }
        };

        await websiteSectionRepository.AddAsync(textSection);
    }
}
