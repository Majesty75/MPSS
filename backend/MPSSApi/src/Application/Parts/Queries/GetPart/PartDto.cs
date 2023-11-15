using MPSSApi.Application.Vendors.Queries.GetVendors;
using MPSSApi.Domain.Entities;

namespace MPSSApi.Application.Parts.Queries.GetPart;
public class PartDto
{
    public int Id { get; set; }

    public string PartName { get; set; } = string.Empty;

    public string PartNumber { get; set; } = string.Empty;

    public int Quantity { get; set; }

    public decimal Cost { get; set; } = 0;

    public decimal SellPrice { get; set; } = 0;

    public int vendorId { get; set; }

    public VendorsDto? Vendor { get; set; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Part, PartDto>()
                .ForMember(p => p.Vendor, v => v.MapFrom(p => p.Vendor))
                .ForMember(p => p.vendorId, v => v.MapFrom(p => p.Vendor.Id));
        }
    }
}
