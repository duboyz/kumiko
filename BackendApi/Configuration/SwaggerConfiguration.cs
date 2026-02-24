using Microsoft.AspNetCore.Http;
using Microsoft.OpenApi.Models;
using System.Reflection;

namespace BackendApi.Configuration;

public static class SwaggerConfiguration
{
    public static IServiceCollection AddSwaggerConfiguration(this IServiceCollection services)
    {
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "Kumiko Backend API",
                Version = "v1",
                Description = "API for the Kumiko restaurant management system"
            });

            // Map IFormFile to binary schema BEFORE operation filter (so Swagger doesn't try to generate it)
            c.MapType<IFormFile>(() => new OpenApiSchema
            {
                Type = "string",
                Format = "binary"
            });

            // Add parameter filter to handle IFormFile parameters before operation filter
            c.ParameterFilter<FormFileParameterFilter>();

            // Add file upload operation filter (handles multipart/form-data request body)
            c.OperationFilter<FileUploadOperationFilter>();

            // Include XML comments if available
            var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
            var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
            if (File.Exists(xmlPath))
            {
                c.IncludeXmlComments(xmlPath);
            }
        });

        return services;
    }

    public static IApplicationBuilder UseSwaggerConfiguration(this IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        return app;
    }
}