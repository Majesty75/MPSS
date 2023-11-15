using MPSSApi.Application.Common.Models;
using MPSSApi.Application.Parts.Queries.GetPart;
using MPSSApi.Application.Vendors.Queries.GetVendor;
using MPSSApi.Domain.Entities;

namespace MPSSApi.Application.Purchases.Queries.GetPurchase;
public class PurchaseDto
{
    public string? PurchaseNumber { get; set; }

    public decimal Total { get; set; }

    public int vendorId { get; set; }

    public DateTime Date { get; set; }

    public IReadOnlyCollection<RecordDto> Records { get; set; } = new List<RecordDto>();

    public VendorDto? Vendor { get; set; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Purchase, PurchaseDto>()
                .ForMember(p => p.Records, v => v.MapFrom(p => p.Records))
                .ForMember(p => p.Vendor, v => v.MapFrom(p => p.Vendor));
        }
    }
}
