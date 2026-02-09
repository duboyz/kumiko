using BackendApi.Services.Jwt;
using BackendApi.Services;
using BackendApi.Repositories.UserRepository;
using BackendApi.Repositories;
using Resend;

namespace BackendApi.Configuration;

public static class DependencyInjectionConfiguration
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
    {
        // HTTP Context
        services.AddHttpContextAccessor();

        // HTTP Client
        services.AddHttpClient();

        // Resend Email Client
        var resendApiKey = configuration["Email:ResendApiKey"] ?? throw new InvalidOperationException("Resend API key not configured");
        services.AddOptions();
        services.Configure<ResendClientOptions>(o =>
        {
            o.ApiToken = resendApiKey;
        });
        services.AddHttpClient<IResend, ResendClient>();

        // Services
        services.AddScoped<IJwtService, JwtService>();
        services.AddScoped<IOpenAiService, OpenAiService>();
        services.AddScoped<ISubscriptionService, SubscriptionService>();
        services.AddScoped<ITwilioSmsService, TwilioSmsService>();
        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<IStripePaymentService, StripePaymentService>();
        services.AddSingleton<IExpoNotificationService, ExpoNotificationService>();
        services.AddSingleton<ICameraSessionService, CameraSessionService>();

        // Hosted Services
        services.AddHostedService<StripePriceSyncService>();

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