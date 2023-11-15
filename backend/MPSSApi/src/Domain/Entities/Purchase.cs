namespace MPSSApi.Domain.Entities;
public class Purchase : BaseAuditableEntity
{
    public string PurchaseNumber { get; set; } = string.Empty;

    public decimal Total { get; set; }

    public int VendorId { get; set; }

    public Vendor Vendor { get; set; } = null!;

    public DateTime Date { get; set; }

    public IList<Record> Records { get; set; } = new List<Record>();
}

