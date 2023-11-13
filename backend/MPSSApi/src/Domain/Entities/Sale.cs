namespace MPSSApi.Domain.Entities;
public class Sale : BaseAuditableEntity
{
    public int SaleId { get; set; }

    public string? SaleNumber { get; set;}

    public decimal Total {  get; set;}

    public string? CustomerName { get; set; }

    public string? CustomerContact { get; set; }

    public DateTime Date {  get; set; }

    public List<Record> Records { get; set; } = new List<Record>();
}
