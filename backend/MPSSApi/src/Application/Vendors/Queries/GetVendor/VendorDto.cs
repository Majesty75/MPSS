using MPSSApi.Application.Common.Models;
using MPSSApi.Domain.Entities;

namespace MPSSApi.Application.Vendors.Queries.GetVendor;
public class VendorDto
{
    public int Id { get; set; }

    public string? VendorName { get; set; }

    public string? Email { get; set; }

    public string? PhoneNo { get; set; }

    public AddressCommand? Address { get; set; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Vendor, VendorDto>()
                .ForMember(v => v.Address,
                    m => m.MapFrom(v => new AddressCommand()
                    {
                        Street = v.Street,
                        City = v.City,
                        Zip = v.Zip,
                        Country = v.Country
                    })
                );
        }
    }
}
