using MPSSApi.Domain.Entities;

namespace MPSSApi.Application.Parts.Queries.GetParts;
public class PartsDto
{
    public int Id { get; set; }

    public string PartName { get; set; } = string.Empty;

    public string PartNumber { get; set; } = string.Empty;

    public decimal Cost { get; set; } = 0;

    public decimal SellPrice { get; set; } = 0;

    public string? vendorName { get; set; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Part, PartsDto>()
                .ForMember(p => p.vendorName, v => v.MapFrom(p => p.Vendor.VendorName));
        }
    }
}
