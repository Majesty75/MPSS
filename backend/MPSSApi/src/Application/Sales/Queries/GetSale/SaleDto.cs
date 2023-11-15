using MPSSApi.Application.Common.Models;
using MPSSApi.Application.Parts.Queries.GetPart;
using MPSSApi.Domain.Entities;

namespace MPSSApi.Application.Sales.Queries.GetSale;
public class SaleDto
{
    public string? SaleNumber { get; set; }

    public decimal Total { get; set; }

    public string? CustomerName { get; set; }

    public string? CustomerContact { get; set; }

    public DateTime Date { get; set; }

    public IReadOnlyCollection<RecordDto> Records { get; set; } = new List<RecordDto>();

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Sale, SaleDto>()
                .ForMember(p => p.Records, v => v.MapFrom(p => p.Records));
        }
    }
}
