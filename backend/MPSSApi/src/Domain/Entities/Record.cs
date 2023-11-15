namespace MPSSApi.Domain.Entities;
public class Record : BaseAuditableEntity
{
    public int PartId { get; set; }

    public int? SaleId { get; set; }

    public int? PurchaseId { get; set; }

    public int Quantity { get; set; }

    public decimal Price { get; set; } = 0;

    public decimal Total { get; set; } = 0;

    public DateTime Date { get; set; }

    public Part Part { get; set; } = null!;
}
