using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using MPSSApi.Domain.Entities;

namespace MPSSApi.Infrastructure.Data.Configurations;
public class SaleConfiguration : IEntityTypeConfiguration<Sale>
{
    public void Configure(EntityTypeBuilder<Sale> builder)
    {
        builder
            .Property(t => t.SaleNumber)
            .IsRequired();

        builder
            .Property(t => t.Total)
            .HasPrecision(18, 2)
            .IsRequired();

        builder
            .Property(t => t.CustomerName)
            .HasMaxLength(200)
            .IsRequired(false);

        builder
            .Property(t => t.CustomerContact)
            .HasMaxLength(20)
            .IsRequired(false);

        builder
            .Property(t => t.Date)
            .IsRequired();

        builder
            .HasMany(t => t.Records)
            .WithOne()
            .HasForeignKey(t => t.SaleId)
            .IsRequired(false);
    }
}
