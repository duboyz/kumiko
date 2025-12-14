namespace BackendApi.Configuration;

public static class CorsConfiguration
{
    public static IServiceCollection AddCorsConfiguration(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            // Policy for authenticated requests (with credentials)
            options.AddPolicy("AllowAll", policy =>
            {
                policy.SetIsOriginAllowed(origin =>
                {
                    // Allow localhost with any port
                    if (origin.StartsWith("http://localhost:") || origin.StartsWith("https://localhost:"))
                        return true;

                    // Allow localhost subdomains with port 3000
                    if (origin.StartsWith("http://") && (origin.EndsWith(".localhost:3000") || origin.EndsWith(".localhost:3003")))
                        return true;

                    // Allow specific production domains
                    var allowedOrigins = new[]
                    {
                        "https://kumiko-web.vercel.app",
                        "https://kumiko.no"
                    };

                    if (allowedOrigins.Contains(origin))
                        return true;

                    // Allow any subdomain of kumiko-web.vercel.app
                    if (origin.StartsWith("https://") && origin.EndsWith(".kumiko-web.vercel.app"))
                        return true;

                    // Allow any subdomain of kumiko.no
                    if (origin.StartsWith("https://") && origin.Contains(".kumiko.no"))
                        return true;

                    return false;
                })
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials();
            });

            // Policy for public endpoints (without credentials)
            options.AddPolicy("AllowPublic", policy =>
            {
                policy.SetIsOriginAllowed(origin =>
                {
                    // Allow localhost with any port
                    if (origin.StartsWith("http://localhost:") || origin.StartsWith("https://localhost:"))
                        return true;

                    // Allow localhost subdomains
                    if (origin.StartsWith("http://") && (origin.EndsWith(".localhost:3000") || origin.EndsWith(".localhost:3003") || origin.EndsWith(".localhost:3004")))
                        return true;

                    // Allow specific production domains
                    var allowedOrigins = new[]
                    {
                        "https://kumiko-web.vercel.app",
                        "https://kumiko.no"
                    };

                    if (allowedOrigins.Contains(origin))
                        return true;

                    // Allow any subdomain of kumiko-web.vercel.app
                    if (origin.StartsWith("https://") && origin.EndsWith(".kumiko-web.vercel.app"))
                        return true;

                    // Allow any subdomain of kumiko.no
                    if (origin.StartsWith("https://") && origin.Contains(".kumiko.no"))
                        return true;

                    return false;
                })
                .AllowAnyMethod()
                .AllowAnyHeader();
                // Note: No AllowCredentials() for public endpoints
            });
        });

        return services;
    }

    public static IApplicationBuilder UseCorsConfiguration(this IApplicationBuilder app)
    {
        app.UseCors("AllowAll");
        return app;
    }
}