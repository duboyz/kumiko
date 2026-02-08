using System.Threading.RateLimiting;
using BackendApi.Configuration;
using BackendApi.Middleware;
using Microsoft.AspNetCore.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddJsonConfiguration();
builder.Services.AddDatabaseConfiguration(builder.Configuration);
builder.Services.AddJwtAuthentication(builder.Configuration);
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddMediatRServices(); // Add MediatR
builder.Services.AddCorsConfiguration();
builder.Services.AddSwaggerConfiguration();

// Rate limiting: prevent order spam (e.g. scripts sending thousands of orders)
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddPolicy("CreateOrder", context =>
    {
        // Partition by IP (use X-Forwarded-For when behind proxy, otherwise RemoteIpAddress)
        var forwarded = context.Request.Headers["X-Forwarded-For"].FirstOrDefault();
        var ip = !string.IsNullOrEmpty(forwarded)
            ? forwarded.Split(',')[0].Trim()
            : context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        return RateLimitPartition.GetFixedWindowLimiter(ip, _ => new FixedWindowRateLimiterOptions
        {
            PermitLimit = 5,
            Window = TimeSpan.FromMinutes(1),
            AutoReplenishment = true
        });
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
app.UseCorsConfiguration(); // CORS must be before other middleware
app.UseSwaggerConfiguration(app.Environment);
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();