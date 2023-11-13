namespace MPSSApi.Domain.Entities;
public class Part : BaseAuditableEntity
{
    public string PartName { get; set; } = string.Empty;

    public string PartNumber { get; set; } = string.Empty;

    public decimal Cost { get; set; } = 0;

    public decimal SellPrice { get; set; } = 0;

    public int? VendorId { get; set; }

    public Vendor? Vendor { get; set; }
}
