using MPSSApi.Domain.Entities;

namespace MPSSApi.Application.Vendors.Queries.GetVendors;
public class VendorDto
{
    public int Id { get; set; }

    public string? VendorName { get; set; }

    public string? Email { get; set; }

    public string? PhoneNo { get; set; }

    public string? Street { get; set; }

    public string? City { get; set; }

    public string? Zip { get; set; }

    public string? Country { get; set; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Vendor, VendorDto>();
        }
    }
}
