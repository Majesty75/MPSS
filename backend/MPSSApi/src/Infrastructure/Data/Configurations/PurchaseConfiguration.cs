using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using MPSSApi.Domain.Entities;

namespace MPSSApi.Infrastructure.Data.Configurations;
public class PurchaseConfiguration : IEntityTypeConfiguration<Purchase>
{
    public void Configure(EntityTypeBuilder<Purchase> builder)
    {
        builder
            .Property(t => t.PurchaseNumber)
            .HasMaxLength(20)
            .IsRequired();

        builder
            .Property(t => t.Total)
            .HasPrecision(18, 2)
            .IsRequired();

        builder
            .HasOne(t => t.Vendor)
            .WithMany()
            .HasForeignKey(e => e.VendorId)
            .IsRequired();

        builder
            .Property(t => t.Date)
            .IsRequired();

        builder
            .HasMany(t => t.Records)
            .WithOne()
            .HasForeignKey(t => t.PurchaseId)
            .IsRequired(false);
    }
}

