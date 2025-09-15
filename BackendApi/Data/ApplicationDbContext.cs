using Microsoft.EntityFrameworkCore;
using BackendApi.Entities;
using BackendApi.Data.Configurations;

namespace BackendApi.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    // User-related DbSets
    public DbSet<User> Users { get; set; }

    // Restaurant-related DbSets
    public DbSet<Restaurant> Restaurants { get; set; }
    public DbSet<UserRestaurant> UserRestaurants { get; set; }

    // Menu-related DbSets
    public DbSet<RestaurantMenu> RestaurantMenus { get; set; }
    public DbSet<MenuCategory> MenuCategories { get; set; }
    public DbSet<MenuItem> MenuItems { get; set; }
    public DbSet<MenuItemOption> MenuItemOptions { get; set; }
    public DbSet<Allergen> Allergens { get; set; }
    public DbSet<MenuItemAllergen> MenuItemAllergens { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Apply configurations from separate files
        modelBuilder.ConfigureUser();
        modelBuilder.ConfigureRestaurant();
        modelBuilder.ConfigureMenu();
    }
}