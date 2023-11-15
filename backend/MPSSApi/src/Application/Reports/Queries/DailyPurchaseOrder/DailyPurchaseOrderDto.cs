namespace MPSSApi.Application.Reports.Queries.DailyPurchaseOrder;
public class DailyPurchaseOrderDto
{
    public DateTime Date { get; set; }

    public IReadOnlyCollection<DailyPurchaseOrderRecordDto> DailyPurchaseOrderRecords { get; set; } = new List<DailyPurchaseOrderRecordDto>();
}

public class DailyPurchaseOrderRecordDto
{
    public int PartId { get; set; }

    public string? PartName { get; set; }

    public int Quantity { get; set; }

    public decimal Cost { get; set; }

    public int? VendorId { get; set; }

    public string? VendorName { get; set; }

    public string? VendorAddress { get; set; }

    public string? VendorContact { get; set; }
}
