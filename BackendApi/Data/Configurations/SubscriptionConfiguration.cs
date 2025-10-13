using Microsoft.EntityFrameworkCore;
using BackendApi.Entities;

namespace BackendApi.Data.Configurations;

public static class SubscriptionConfiguration
{
    public static void ConfigureSubscription(this ModelBuilder modelBuilder)
    {
        // SubscriptionPlan entity configuration
        modelBuilder.Entity<SubscriptionPlan>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Tier).HasConversion<string>().IsRequired();
            entity.Property(e => e.MonthlyPrice).HasPrecision(18, 2).IsRequired();
            entity.Property(e => e.YearlyPrice).HasPrecision(18, 2).IsRequired();
            entity.Property(e => e.MaxLocations).IsRequired();
            entity.Property(e => e.MaxMenusPerLocation).IsRequired();
            entity.Property(e => e.StripePriceIdMonthly).HasMaxLength(200);
            entity.Property(e => e.StripePriceIdYearly).HasMaxLength(200);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.CreatedAt).IsRequired();

            entity.HasIndex(e => e.Tier).IsUnique();
        });

        // UserSubscription entity configuration
        modelBuilder.Entity<UserSubscription>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Status).HasConversion<string>().IsRequired();
            entity.Property(e => e.BillingInterval).HasConversion<string>().IsRequired();
            entity.Property(e => e.StripeCustomerId).HasMaxLength(200);
            entity.Property(e => e.StripeSubscriptionId).HasMaxLength(200);
            entity.Property(e => e.CreatedAt).IsRequired();

            // One-to-One relationship with User
            entity.HasOne(s => s.User)
                .WithOne(u => u.Subscription)
                .HasForeignKey<UserSubscription>(s => s.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Many-to-One relationship with SubscriptionPlan
            entity.HasOne(s => s.SubscriptionPlan)
                .WithMany(p => p.UserSubscriptions)
                .HasForeignKey(s => s.SubscriptionPlanId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(e => e.UserId).IsUnique();
            entity.HasIndex(e => e.StripeCustomerId);
            entity.HasIndex(e => e.StripeSubscriptionId);
        });

        // Seed initial subscription plans
        modelBuilder.Entity<SubscriptionPlan>().HasData(
            new SubscriptionPlan
            {
                Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                Name = "Basic",
                Tier = SubscriptionTier.Basic,
                MonthlyPrice = 29.99m,
                YearlyPrice = 299.99m,
                MaxLocations = 1,
                MaxMenusPerLocation = 3,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new SubscriptionPlan
            {
                Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                Name = "Premium",
                Tier = SubscriptionTier.Premium,
                MonthlyPrice = 79.99m,
                YearlyPrice = 799.99m,
                MaxLocations = 3,
                MaxMenusPerLocation = 3,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new SubscriptionPlan
            {
                Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                Name = "Enterprise",
                Tier = SubscriptionTier.Enterprise,
                MonthlyPrice = 199.99m,
                YearlyPrice = 1999.99m,
                MaxLocations = -1, // -1 represents unlimited
                MaxMenusPerLocation = -1, // -1 represents unlimited
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            }
        );
    }
}
