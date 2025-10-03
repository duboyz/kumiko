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

    // Hospitality-related DbSets
    public DbSet<Hospitality> Hospitalities { get; set; }
    public DbSet<UserHospitality> UserHospitalities { get; set; }
    public DbSet<HospitalityRoom> HospitalityRooms { get; set; }

    // Menu-related DbSets
    public DbSet<RestaurantMenu> RestaurantMenus { get; set; }
    public DbSet<MenuCategory> MenuCategories { get; set; }
    public DbSet<MenuItem> MenuItems { get; set; }
    public DbSet<MenuCategoryItem> MenuCategoryItems { get; set; }
    public DbSet<MenuItemOption> MenuItemOptions { get; set; }
    public DbSet<Allergen> Allergens { get; set; }
    public DbSet<MenuItemAllergen> MenuItemAllergens { get; set; }

    // Website-related DbSets
    public DbSet<Website> Websites { get; set; }
    public DbSet<WebsitePage> WebsitePages { get; set; }
    public DbSet<WebsiteSection> WebsiteSections { get; set; }
    public DbSet<HeroSection> HeroSections { get; set; }
    public DbSet<TextSection> TextSections { get; set; }
    public DbSet<RestaurantMenuSection> RestaurantMenuSections { get; set; }
    public DbSet<TextAndImageSection> TextAndImageSections { get; set; }

    // Order-related DbSets
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Apply configurations from separate files
        modelBuilder.ConfigureUser();
        modelBuilder.ConfigureRestaurant();
        modelBuilder.ConfigureMenu();
        modelBuilder.ConfigureWebsite();
        modelBuilder.ConfigureHospitality();
    }
}