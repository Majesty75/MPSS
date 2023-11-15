using MPSSApi.Application.Purchases.Queries.GetPurchase;
using MPSSApi.Domain.Entities;

namespace MPSSApi.Application.Common.Models;
public record RecordCommand
{
    public int Id { get; set; }

    public int PartId { get; set; }

    public int Quantity { get; set; }

    public decimal Price { get; set; } = 0;

    public decimal Total => Price * Quantity;

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<RecordCommand, Record>();
        }
    }
}
