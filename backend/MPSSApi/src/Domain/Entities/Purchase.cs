namespace MPSSApi.Domain.Entities;
public class Purchase : BaseAuditableEntity
{
    public int PurchaseId { get; set; }

    public string? PurchaseNumber { get; set; }

    public decimal Total { get; set; }

    public Vendor Vendor { get; set; } = null!;

    public DateTime Date { get; set; }

    public List<Record> Records { get; set; } = new List<Record>();
}

