using MPSSApi.Application.Parts.Queries.GetParts;
using MPSSApi.Domain.Entities;

namespace MPSSApi.Application.Common.Models;
public record RecordDto
{
    public int Id { get; set; }

    public int PartId { get; set; }

    public int? SaleId { get; set; }

    public int? PurchaseId { get; set; }

    public int Quantity { get; set; }

    public decimal Price { get; set; } = 0;

    public decimal Total { get; set; } = 0;

    public DateTime Date { get; set; }

    public PartsDto? Part { get; set; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Record, RecordDto>()
                .ForMember(p => p.Part, v => v.MapFrom(p => p.Part));
        }
    }
}
