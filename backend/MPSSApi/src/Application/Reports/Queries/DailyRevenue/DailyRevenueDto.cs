namespace MPSSApi.Application.Reports.Queries.DailyRevenue;
public class DailyRevenueDto
{
    public string? Date { get; set; }

    public int Day { get; set; }

    public decimal Revenue { get; set; }
}
