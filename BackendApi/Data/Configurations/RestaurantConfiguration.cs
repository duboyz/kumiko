using Microsoft.EntityFrameworkCore;
using BackendApi.Entities;

namespace BackendApi.Data.Configurations;

public static class RestaurantConfiguration
{
    public static void ConfigureRestaurant(this ModelBuilder modelBuilder)
    {
        // Restaurant entity configuration
        modelBuilder.Entity<Restaurant>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.GooglePlaceId).HasMaxLength(100);
            entity.Property(e => e.Address).HasMaxLength(500);
            entity.Property(e => e.City).HasMaxLength(100);
            entity.Property(e => e.State).HasMaxLength(100);
            entity.Property(e => e.Zip).HasMaxLength(20);
            entity.Property(e => e.Country).HasMaxLength(100);
            entity.Property(e => e.Latitude).HasMaxLength(50);
            entity.Property(e => e.Longitude).HasMaxLength(50);
            entity.Property(e => e.Currency)
                .HasConversion<string>()
                .HasDefaultValue(Currency.USD)
                .HasSentinel(Currency.Unspecified);
        });

        // UserRestaurant (junction table) configuration
        modelBuilder.Entity<UserRestaurant>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.UserId, e.RestaurantId }).IsUnique();

            entity.HasOne(e => e.User)
                .WithMany(u => u.Restaurants)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Restaurant)
                .WithMany(r => r.Staff)
                .HasForeignKey(e => e.RestaurantId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
