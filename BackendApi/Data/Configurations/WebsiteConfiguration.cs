using BackendApi.Entities;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Data.Configurations;

public static class WebsiteConfiguration
{
    public static void ConfigureWebsite(this ModelBuilder modelBuilder)
    {
        // Website entity
        modelBuilder.Entity<Website>(entity =>
        {
            entity.HasKey(w => w.Id);
            entity.Property(w => w.Name).IsRequired().HasMaxLength(200);
            entity.Property(w => w.Subdomain).IsRequired().HasMaxLength(100);
            entity.Property(w => w.Description).HasMaxLength(500);
            entity.Property(w => w.IsPublished).HasDefaultValue(false);

            // Create unique index on subdomain
            entity.HasIndex(w => w.Subdomain).IsUnique();

            // Relationship to Restaurant
            entity.HasOne(w => w.Restaurant)
                  .WithMany()
                  .HasForeignKey(w => w.RestaurantId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // WebsitePage entity
        modelBuilder.Entity<WebsitePage>(entity =>
        {
            entity.HasKey(wp => wp.Id);
            entity.Property(wp => wp.Slug).IsRequired().HasMaxLength(200);
            entity.Property(wp => wp.Title).IsRequired().HasMaxLength(200);
            entity.Property(wp => wp.SeoTitle).HasMaxLength(200);
            entity.Property(wp => wp.SeoDescription).HasMaxLength(300);
            entity.Property(wp => wp.SeoKeywords).HasMaxLength(500);
            entity.Property(wp => wp.Subdomain).IsRequired().HasMaxLength(100);

            // Relationship to Website
            entity.HasOne(wp => wp.Website)
                  .WithMany(w => w.Pages)
                  .HasForeignKey(wp => wp.WebsiteId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // WebsiteSection entity
        modelBuilder.Entity<WebsiteSection>(entity =>
        {
            entity.HasKey(ws => ws.Id);
            entity.Property(ws => ws.SortOrder).IsRequired();

            // Relationship to WebsitePage
            entity.HasOne(ws => ws.WebsitePage)
                  .WithMany(wp => wp.Sections)
                  .HasForeignKey(ws => ws.WebsitePageId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // HeroSection entity
        modelBuilder.Entity<HeroSection>(entity =>
        {
            entity.HasKey(hs => hs.Id);
            entity.Property(hs => hs.Title).IsRequired().HasMaxLength(200);
            entity.Property(hs => hs.Description).IsRequired().HasMaxLength(1000);
            entity.Property(hs => hs.ImageUrl).HasMaxLength(500);
            entity.Property(hs => hs.ImageAlt).HasMaxLength(200);
            entity.Property(hs => hs.BackgroundColor).HasMaxLength(20);
            entity.Property(hs => hs.TextColor).HasMaxLength(20);
            entity.Property(hs => hs.BackgroundOverlayColor).HasMaxLength(20);
            entity.Property(hs => hs.BackgroundImageUrl).HasMaxLength(500);
            entity.Property(hs => hs.ButtonText).HasMaxLength(50);
            entity.Property(hs => hs.ButtonUrl).HasMaxLength(500);
            entity.Property(hs => hs.ButtonTextColor).HasMaxLength(20);
            entity.Property(hs => hs.ButtonBackgroundColor).HasMaxLength(20);
            entity.Property(hs => hs.Type).HasConversion<string>();

            // Relationship to WebsiteSection
            entity.HasOne(hs => hs.WebsiteSection)
                  .WithOne(ws => ws.HeroSection)
                  .HasForeignKey<HeroSection>(hs => hs.WebsiteSectionId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // RestaurantMenuSection entity
        modelBuilder.Entity<RestaurantMenuSection>(entity =>
        {
            entity.HasKey(rms => rms.Id);
            entity.Property(rms => rms.AllowOrdering).HasDefaultValue(true);

            // Relationship to RestaurantMenu
            entity.HasOne(rms => rms.RestaurantMenu)
                  .WithMany()
                  .HasForeignKey(rms => rms.RestaurantMenuId)
                  .OnDelete(DeleteBehavior.Cascade);

            // Relationship to WebsiteSection
            entity.HasOne(rms => rms.WebsiteSection)
                  .WithOne(ws => ws.RestaurantMenuSection)
                  .HasForeignKey<RestaurantMenuSection>(rms => rms.WebsiteSectionId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}