using MPSSApi.Application.Purchases.Queries.GetPurchase;
using MPSSApi.Domain.Entities;

namespace MPSSApi.Application.Purchases.Queries.GetPurchasesWithPagination;
public class PurchasesDto
{
    public int Id { get; set; }

    public string? PurchaseNumber { get; set; }

    public decimal Total { get; set; }

    public string? vendorName { get; set; }

    public DateTime Date { get; set; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Purchase, PurchasesDto>()
                .ForMember(p => p.vendorName, v => v.MapFrom(p => p.Vendor.VendorName));
        }
    }
}
