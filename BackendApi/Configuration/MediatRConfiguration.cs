using System.Reflection;
using MediatR;

namespace BackendApi.Configuration;

public static class MediatRConfiguration
{
    public static IServiceCollection AddMediatRServices(this IServiceCollection services)
    {
        services.AddMediatR(cfg =>
            cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));

        return services;
    }
}