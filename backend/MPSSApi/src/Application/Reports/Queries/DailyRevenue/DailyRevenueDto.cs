namespace MPSSApi.Application.Reports.Queries.DailyRevenue;
public class DailyRevenueDto
{
    public DateTime Date { get; set; }

    public int Day { get; set; }

    public decimal Revenue { get; set; }
}
