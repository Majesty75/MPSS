namespace MPSSApi.Domain.Entities;
public class Vendor : BaseAuditableEntity
{
    public string? VendorName { get; set; }

    public string? Email { get; set; }

    public string? PhoneNo { get; set; }

    public string? Street { get; set; }

    public string ? City { get; set; }

    public string? Zip { get; set; }

    public string? Country { get; set; }

    public IList<Part> Parts { get; set; } = new List<Part>();

}
