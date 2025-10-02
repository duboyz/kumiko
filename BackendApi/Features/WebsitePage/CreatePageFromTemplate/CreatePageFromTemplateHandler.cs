using BackendApi.Extensions;
using BackendApi.Repositories;
using BackendApi.Shared.Contracts;

namespace BackendApi.Features.WebsitePage.CreatePageFromTemplate;

public class CreatePageFromTemplateHandler(
    IWebsiteRepository websiteRepository,
    IWebsitePageRepository websitePageRepository,
    IWebsiteSectionRepository websiteSectionRepository,
    IUserRestaurantRepository userRestaurantRepository,
    IUserHospitalityRepository userHospitalityRepository,
    IHttpContextAccessor httpContextAccessor) : ICommandHandler<CreatePageFromTemplateCommand, CreatePageFromTemplateResult>
{
    public async Task<CreatePageFromTemplateResult> Handle(CreatePageFromTemplateCommand request, CancellationToken cancellationToken)
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

        // Get template configuration
        var (title, slug, seoTitle, seoDescription) = GetTemplateDefaults(request.Template);

        // Use custom values if provided
        var finalTitle = request.CustomTitle ?? title;
        var finalSlug = request.CustomSlug ?? slug;

        // Check if slug already exists for this website
        var existingPages = await websitePageRepository.FindAsync(p => p.WebsiteId == request.WebsiteId && p.Slug == finalSlug);
        if (existingPages.Any())
        {
            throw new InvalidOperationException("A page with this slug already exists");
        }

        // Create the page
        var page = new Entities.WebsitePage
        {
            Slug = finalSlug,
            Title = finalTitle,
            SeoTitle = seoTitle,
            SeoDescription = seoDescription,
            WebsiteId = request.WebsiteId,
            Subdomain = website.Subdomain
        };

        await websitePageRepository.AddAsync(page);

        // Create sections based on template
        await CreateTemplateSections(request.Template, page.Id, request.RestaurantMenuId);

        return new CreatePageFromTemplateResult(page.Id, finalTitle, finalSlug);
    }

    private (string Title, string Slug, string SeoTitle, string SeoDescription) GetTemplateDefaults(Entities.PageTemplate template)
    {
        return template switch
        {
            Entities.PageTemplate.FrontPage => (
                "Home",
                "home",
                "Welcome to Our Restaurant",
                "Experience exceptional dining with our carefully crafted menu and warm atmosphere"
            ),
            Entities.PageTemplate.MenuPage => (
                "Menu",
                "menu",
                "Our Menu",
                "Explore our delicious selection of dishes"
            ),
            Entities.PageTemplate.AboutPage => (
                "About Us",
                "about",
                "About Our Restaurant",
                "Learn more about our story and what makes us special"
            ),
            Entities.PageTemplate.ContactPage => (
                "Contact",
                "contact",
                "Contact Us",
                "Get in touch with us for reservations and inquiries"
            ),
            Entities.PageTemplate.Blank => (
                "New Page",
                "new-page",
                "",
                ""
            ),
            _ => throw new ArgumentException("Invalid template type")
        };
    }

    private async Task CreateTemplateSections(Entities.PageTemplate template, Guid pageId, Guid? restaurantMenuId)
    {
        switch (template)
        {
            case Entities.PageTemplate.FrontPage:
                await CreateFrontPageSections(pageId);
                break;
            case Entities.PageTemplate.MenuPage:
                await CreateMenuPageSections(pageId, restaurantMenuId);
                break;
            case Entities.PageTemplate.AboutPage:
                await CreateAboutPageSections(pageId);
                break;
            case Entities.PageTemplate.ContactPage:
                await CreateContactPageSections(pageId);
                break;
            case Entities.PageTemplate.Blank:
                // No sections for blank page
                break;
        }
    }

    private async Task CreateFrontPageSections(Guid pageId)
    {
        // Hero Section
        var heroSection = new Entities.WebsiteSection
        {
            WebsitePageId = pageId,
            SortOrder = 0,
            HeroSection = new Entities.HeroSection
            {
                Title = "Welcome to Our Restaurant",
                Description = "Experience exceptional dining with our carefully crafted menu and warm atmosphere",
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
                Text = "We are committed to bringing you the finest dining experience with carefully selected ingredients and expertly crafted dishes.",
                AlignText = Entities.TextAlignment.Center,
                TextColor = "#000000"
            }
        };

        await websiteSectionRepository.AddAsync(textSection);
    }

    private async Task CreateMenuPageSections(Guid pageId, Guid? restaurantMenuId)
    {
        if (!restaurantMenuId.HasValue)
        {
            throw new InvalidOperationException("RestaurantMenuId is required for MenuPage template");
        }

        var menuSection = new Entities.WebsiteSection
        {
            WebsitePageId = pageId,
            SortOrder = 0,
            RestaurantMenuSection = new Entities.RestaurantMenuSection
            {
                RestaurantMenuId = restaurantMenuId.Value,
                AllowOrdering = false
            }
        };

        await websiteSectionRepository.AddAsync(menuSection);
    }

    private async Task CreateAboutPageSections(Guid pageId)
    {
        // Hero Section
        var heroSection = new Entities.WebsiteSection
        {
            WebsitePageId = pageId,
            SortOrder = 0,
            HeroSection = new Entities.HeroSection
            {
                Title = "About Us",
                Description = "Discover our story and passion for great food",
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
                Text = "We believe in using the finest ingredients and traditional cooking methods to create memorable dining experiences.",
                AlignText = Entities.TextAlignment.Left,
                TextColor = "#000000"
            }
        };

        await websiteSectionRepository.AddAsync(textSection);
    }

    private async Task CreateContactPageSections(Guid pageId)
    {
        var textSection = new Entities.WebsiteSection
        {
            WebsitePageId = pageId,
            SortOrder = 0,
            TextSection = new Entities.TextSection
            {
                Title = "Get in Touch",
                Text = "We'd love to hear from you. Contact us for reservations, inquiries, or any questions you may have.",
                AlignText = Entities.TextAlignment.Center,
                TextColor = "#000000"
            }
        };

        await websiteSectionRepository.AddAsync(textSection);
    }
}
