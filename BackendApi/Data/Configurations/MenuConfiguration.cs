using Microsoft.EntityFrameworkCore;
using BackendApi.Entities;

namespace BackendApi.Data.Configurations;

public static class MenuConfiguration
{
    public static void ConfigureMenu(this ModelBuilder modelBuilder)
    {
        // RestaurantMenu entity configuration
        modelBuilder.Entity<RestaurantMenu>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(1000);

            entity.HasOne(e => e.Restaurant)
                .WithMany(r => r.Menus)
                .HasForeignKey(e => e.RestaurantId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // MenuCategory entity configuration
        modelBuilder.Entity<MenuCategory>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(1000);

            entity.HasOne(e => e.RestaurantMenu)
                .WithMany(m => m.Categories)
                .HasForeignKey(e => e.RestaurantMenuId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // MenuItem entity configuration
        modelBuilder.Entity<MenuItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.Price).HasPrecision(10, 2);

            entity.HasOne(e => e.RestaurantMenu)
                .WithMany()
                .HasForeignKey(e => e.RestaurantMenuId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // MenuCategoryItem (junction table) configuration
        modelBuilder.Entity<MenuCategoryItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.OrderIndex).IsRequired();
            entity.HasIndex(e => new { e.MenuCategoryId, e.MenuItemId }).IsUnique();

            entity.HasOne(e => e.MenuCategory)
                .WithMany(c => c.MenuCategoryItems)
                .HasForeignKey(e => e.MenuCategoryId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.MenuItem)
                .WithMany(i => i.MenuCategoryItems)
                .HasForeignKey(e => e.MenuItemId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // MenuItemOption entity configuration
        modelBuilder.Entity<MenuItemOption>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.PriceModifier).HasPrecision(10, 2);

            entity.HasOne(e => e.MenuItem)
                .WithMany(i => i.Options)
                .HasForeignKey(e => e.MenuItemId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Allergen entity configuration
        modelBuilder.Entity<Allergen>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.HasIndex(e => e.Name).IsUnique();
        });

        // MenuItemAllergen (junction table) configuration
        modelBuilder.Entity<MenuItemAllergen>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.MenuItemId, e.AllergenId }).IsUnique();

            entity.HasOne(e => e.MenuItem)
                .WithMany(i => i.Allergens)
                .HasForeignKey(e => e.MenuItemId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Allergen)
                .WithMany()
                .HasForeignKey(e => e.AllergenId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure many-to-many relationships for MenuItemOption allergens
        modelBuilder.Entity<MenuItemOption>()
            .HasMany(o => o.RemovedAllergens)
            .WithMany()
            .UsingEntity(j => j.ToTable("MenuItemOptionRemovedAllergens"));

        modelBuilder.Entity<MenuItemOption>()
            .HasMany(o => o.AddedAllergens)
            .WithMany()
            .UsingEntity(j => j.ToTable("MenuItemOptionAddedAllergens"));
    }
}
