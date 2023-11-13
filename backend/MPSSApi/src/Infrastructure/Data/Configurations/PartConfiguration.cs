using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using MPSSApi.Domain.Entities;

namespace MPSSApi.Infrastructure.Data.Configurations;
public class PartConfiguration : IEntityTypeConfiguration<Part>
{
    public void Configure(EntityTypeBuilder<Part> builder)
    {
        builder
            .Property(t => t.PartName)
            .HasMaxLength(200)
            .IsRequired();

        builder
            .Property(t => t.PartNumber)
            .HasMaxLength(50)
            .IsRequired();

        builder
            .Property(t => t.Cost)
            .HasPrecision(18, 2)
            .HasDefaultValue(0);

        builder
            .Property(t => t.SellPrice)
            .HasPrecision(18, 2)
            .HasDefaultValue(0);
    }
}

