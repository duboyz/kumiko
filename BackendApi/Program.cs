using BackendApi.Configuration;
using BackendApi.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddJsonConfiguration();
builder.Services.AddDatabaseConfiguration(builder.Configuration);
builder.Services.AddJwtAuthentication(builder.Configuration);
builder.Services.AddApplicationServices();
builder.Services.AddMediatRServices(); // Add MediatR
builder.Services.AddCorsConfiguration();
builder.Services.AddSwaggerConfiguration();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Production", policy =>
    {
        policy.WithOrigins(
            "https://kumiko.no",
            "https://*.kumiko.no",  // Allow all subdomains
            "https://kumiko-web.vercel.app",  // Vercel deployment
            "https://*.kumiko-web.vercel.app"  // Vercel subdomains
        )
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
    });
});

var app = builder.Build();

await app.ApplyMigrationsAsync();

// using (var scope = app.Services.CreateScope())
// {
//     var seedDataService = scope.ServiceProvider.GetRequiredService<ISeedDataService>();
//     await seedDataService.SeedSubscriptionPlansAsync();
// }

// Configure the HTTP request pipeline
app.UseMiddleware<ExceptionHandlingMiddleware>(); // Add exception handling first
app.UseSwaggerConfiguration(app.Environment);
// Use production CORS policy in production, otherwise use development policy
if (app.Environment.IsProduction())
{
    app.UseCors("Production");
}
else
{
    app.UseCorsConfiguration();
}
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();