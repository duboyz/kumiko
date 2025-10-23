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
        
        // Add debugging middleware to log CORS headers
        app.Use(async (context, next) =>
        {
            Console.WriteLine($"🌐 CORS Request: {context.Request.Method} {context.Request.Path}");
            Console.WriteLine($"🌐 CORS Origin: {context.Request.Headers.Origin}");
            Console.WriteLine($"🌐 CORS Host: {context.Request.Host}");
            
            await next();
            
            Console.WriteLine($"🌐 CORS Response Headers:");
            foreach (var header in context.Response.Headers)
            {
                if (header.Key.StartsWith("Access-Control"))
                {
                    Console.WriteLine($"🌐   {header.Key}: {string.Join(", ", header.Value)}");
                }
            }
        });
        
        app.UseCors("AllowAll");
        return app;
    }
}