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
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();