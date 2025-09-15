using BackendApi.Services.Jwt;
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


        // Repositories
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IRestaurantRepository, RestaurantRepository>();
        services.AddScoped<IUserRestaurantRepository, UserRestaurantRepository>();
        services.AddScoped<IWebsiteRepository, WebsiteRepository>();


        // Generic Repository implementations
        services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

        return services;
    }
}