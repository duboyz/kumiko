using Microsoft.EntityFrameworkCore;
using BackendApi.Entities;

namespace BackendApi.Data.Configurations;

public static class UserConfiguration
{
    public static void ConfigureUser(this ModelBuilder modelBuilder)
    {
        // User entity configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(256);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.PasswordHash).IsRequired();
            entity.Property(e => e.FirstName).HasMaxLength(100);
            entity.Property(e => e.LastName).HasMaxLength(100);
            entity.Property(e => e.PhoneNumber).HasMaxLength(20);
            entity.Property(e => e.PreferredLanguage)
                .HasConversion<string>()
                .HasDefaultValue(Language.English)
                .HasSentinel(Language.Unspecified);
            entity.Property(e => e.CreatedAt).IsRequired();
        });
    }
}
