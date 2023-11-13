using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using MPSSApi.Domain.Entities;

namespace MPSSApi.Infrastructure.Data.Configurations;
public class VendorConfiguration : IEntityTypeConfiguration<Vendor>
{
    public void Configure(EntityTypeBuilder<Vendor> builder)
    {
        builder
            .Property(t => t.VendorName)
            .HasMaxLength(200);

        builder
            .Property(t => t.Email)
            .HasMaxLength(50);

        builder
            .Property(t => t.PhoneNo)
            .HasMaxLength(20);

        builder
            .Property(t => t.Street)
            .HasMaxLength(50);

        builder
            .Property(t => t.City)
            .HasMaxLength(50);

        builder
            .Property(t => t.Zip)
            .HasMaxLength(10);

        builder
            .Property(t => t.Country)
            .HasMaxLength(50);

        builder.HasMany(t => t.Parts)
            .WithOne(t => t.Vendor)
            .HasForeignKey(t => t.VendorId)
            .IsRequired(false);
    }
}
