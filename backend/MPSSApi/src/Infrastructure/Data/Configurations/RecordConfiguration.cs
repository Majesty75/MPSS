using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using MPSSApi.Domain.Entities;

namespace MPSSApi.Infrastructure.Data.Configurations;
public class RecordConfiguration : IEntityTypeConfiguration<Record>
{
    public void Configure(EntityTypeBuilder<Record> builder)
    {
        builder
            .Property(t => t.Price)
            .HasPrecision(18,2)
            .IsRequired();

        builder
            .Property(t => t.Quantity)
            .IsRequired();

        builder
            .Property(t => t.Total)
            .HasPrecision(18,2)
            .IsRequired();

        builder
            .Property(t => t.Total)
            .HasPrecision(18, 2)
            .IsRequired();

        builder
            .Property(t => t.Date)
            .IsRequired();

        builder
            .HasOne(t => t.Part)
            .WithMany()
            .HasForeignKey(e => e.PartId)
            .IsRequired();
    }
}

