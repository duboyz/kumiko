using System.Text.RegularExpressions;

namespace BackendApi.Configuration;

public static class CorsConfiguration
{
    // *.localhost with any port (e.g. hoggorm.localhost:3001, foo.localhost:3002)
    private static readonly Regex LocalhostSubdomainOrigin = new(@"^https?://[^/]+\.localhost:\d+$");
    // LAN IPs for phone/device testing (e.g. http://192.168.1.5:3000)
    private static readonly Regex LanOrigin = new(@"^https?://(\d{1,3}\.){3}\d{1,3}(:\d+)?$");

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

                    // Allow *.localhost with any port (3000, 3001, 3002, ...)
                    if (LocalhostSubdomainOrigin.IsMatch(origin))
                        return true;

                    // Allow LAN IPs (e.g. phone at 192.168.1.x:3000 for camera session upload)
                    if (!string.IsNullOrEmpty(origin) && LanOrigin.IsMatch(origin))
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

                    // Allow *.localhost with any port (3000, 3001, 3002, ...)
                    if (LocalhostSubdomainOrigin.IsMatch(origin))
                        return true;

                    // Allow LAN IPs (e.g. phone testing)
                    if (!string.IsNullOrEmpty(origin) && LanOrigin.IsMatch(origin))
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