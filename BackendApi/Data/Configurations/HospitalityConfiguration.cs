using BackendApi.Entities;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Data.Configurations;

public static class HospitalityConfiguration
{
    public static void ConfigureHospitality(this ModelBuilder modelBuilder)
    {
        // Hospitality entity
        modelBuilder.Entity<Hospitality>(entity =>
        {
            entity.HasKey(h => h.Id);
            entity.Property(h => h.Name).IsRequired().HasMaxLength(200);
            entity.Property(h => h.GooglePlaceId).HasMaxLength(100);
            entity.Property(h => h.Address).HasMaxLength(500);
            entity.Property(h => h.City).HasMaxLength(100);
            entity.Property(h => h.State).HasMaxLength(100);
            entity.Property(h => h.Zip).HasMaxLength(20);
            entity.Property(h => h.Country).HasMaxLength(100);
            entity.Property(h => h.Latitude).HasMaxLength(50);
            entity.Property(h => h.Longitude).HasMaxLength(50);
            entity.Property(h => h.Description).HasMaxLength(1000);
            entity.Property(h => h.Currency)
                .HasConversion<string>()
                .HasDefaultValue(Currency.USD)
                .HasSentinel(Currency.Unspecified);
        });

        // UserHospitality entity
        modelBuilder.Entity<UserHospitality>(entity =>
        {
            entity.HasKey(uh => uh.Id);
            entity.Property(uh => uh.Role).HasConversion<string>();

            // Relationships
            entity.HasOne(uh => uh.User)
                  .WithMany()
                  .HasForeignKey(uh => uh.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(uh => uh.Hospitality)
                  .WithMany()
                  .HasForeignKey(uh => uh.HospitalityId)
                  .OnDelete(DeleteBehavior.Cascade);

            // Unique constraint
            entity.HasIndex(uh => new { uh.UserId, uh.HospitalityId })
                  .IsUnique();
        });

        // HospitalityRoom entity
        modelBuilder.Entity<HospitalityRoom>(entity =>
        {
            entity.HasKey(hr => hr.Id);
            entity.Property(hr => hr.Name).IsRequired().HasMaxLength(100);
            entity.Property(hr => hr.Description).HasMaxLength(500);
            entity.Property(hr => hr.Capacity).IsRequired();

            // Relationship to Hospitality
            entity.HasOne(hr => hr.Hospitality)
                  .WithMany(h => h.Rooms)
                  .HasForeignKey(hr => hr.HospitalityId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}