namespace BackendApi.Configuration;

public static class CorsConfiguration
{
    public static IServiceCollection AddCorsConfiguration(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddPolicy("AllowAll", policy =>
            {
                policy.WithOrigins(
                    "https://kumiko.no",
                    "https://kumiko-web.vercel.app",
                    "http://localhost:3000",
                    "http://localhost:3003",
                    "https://localhost:3000",
                    "https://localhost:3003"
                )
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials();
                
                Console.WriteLine("🌐 CORS policy configured with origins: https://kumiko.no, https://kumiko-web.vercel.app, localhost variants");
            });
        });

        return services;
    }

    public static IApplicationBuilder UseCorsConfiguration(this IApplicationBuilder app)
    {
        Console.WriteLine("🌐 CORS middleware being applied...");
        app.UseCors("AllowAll");
        return app;
    }
}