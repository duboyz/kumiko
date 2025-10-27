using BackendApi.Services.Jwt;
using BackendApi.Services;
using BackendApi.Repositories.UserRepository;
using BackendApi.Repositories;

namespace BackendApi.Configuration;

public static class DependencyInjectionConfiguration
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // HTTP Context
        services.AddHttpContextAccessor();

        // HTTP Client
        services.AddHttpClient();

        // Services
        services.AddScoped<IJwtService, JwtService>();
        services.AddScoped<IOpenAiService, OpenAiService>();
        services.AddScoped<ISubscriptionService, SubscriptionService>();
        services.AddScoped<ITwilioSmsService, TwilioSmsService>();


        // Repositories
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IRestaurantRepository, RestaurantRepository>();
        services.AddScoped<IUserRestaurantRepository, UserRestaurantRepository>();
        services.AddScoped<IWebsiteRepository, WebsiteRepository>();
        services.AddScoped<IWebsitePageRepository, WebsitePageRepository>();
        services.AddScoped<IWebsiteSectionRepository, WebsiteSectionRepository>();
        services.AddScoped<IHeroSectionRepository, HeroSectionRepository>();
        services.AddScoped<ITextSectionRepository, TextSectionRepository>();
        services.AddScoped<IRestaurantMenuSectionRepository, RestaurantMenuSectionRepository>();
        services.AddScoped<ITextAndImageSectionRepository, TextAndImageSectionRepository>();
        services.AddScoped<IHospitalityRepository, HospitalityRepository>();
        services.AddScoped<IUserHospitalityRepository, UserHospitalityRepository>();


        // Generic Repository implementations
        services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

        return services;
    }
}