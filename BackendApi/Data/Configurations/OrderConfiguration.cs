using Microsoft.EntityFrameworkCore;
using BackendApi.Entities;

namespace BackendApi.Data.Configurations;

public static class OrderConfiguration
{
    public static void ConfigureOrder(this ModelBuilder modelBuilder)
    {
        // Order entity configuration
        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.CustomerName).IsRequired().HasMaxLength(200);
            entity.Property(e => e.CustomerPhone).IsRequired().HasMaxLength(50);
            entity.Property(e => e.CustomerEmail).IsRequired().HasMaxLength(200);
            entity.Property(e => e.PickupDate).IsRequired();
            entity.Property(e => e.PickupTime).IsRequired();
            entity.Property(e => e.AdditionalNote).HasMaxLength(1000);
            entity.Property(e => e.Status).IsRequired();
            entity.Property(e => e.PaymentStatus).IsRequired().HasDefaultValue(PaymentStatus.NotRequired);
            entity.Property(e => e.StripePaymentIntentId).HasMaxLength(255);
            entity.Property(e => e.PlatformFeeAmount).HasPrecision(10, 2);
            entity.Property(e => e.TotalAmount).IsRequired().HasPrecision(10, 2);

            entity.HasOne(e => e.Restaurant)
                .WithMany()
                .HasForeignKey(e => e.RestaurantId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.RestaurantMenu)
                .WithMany()
                .HasForeignKey(e => e.RestaurantMenuId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(e => e.RestaurantId);
            entity.HasIndex(e => e.PickupDate);
            entity.HasIndex(e => e.Status);
        });

        // OrderItem entity configuration
        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Quantity).IsRequired();
            entity.Property(e => e.PriceAtOrder).IsRequired().HasPrecision(10, 2);
            entity.Property(e => e.SpecialInstructions).HasMaxLength(500);

            entity.HasOne(e => e.Order)
                .WithMany(o => o.OrderItems)
                .HasForeignKey(e => e.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.MenuItem)
                .WithMany()
                .HasForeignKey(e => e.MenuItemId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.MenuItemOption)
                .WithMany()
                .HasForeignKey(e => e.MenuItemOptionId)
                .OnDelete(DeleteBehavior.Restrict)
                .IsRequired(false);
        });
    }
}

