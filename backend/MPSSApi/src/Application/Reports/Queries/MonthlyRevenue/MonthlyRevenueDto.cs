using MPSSApi.Application.Reports.Queries.DailyRevenue;

namespace MPSSApi.Application.Reports.Queries.MonthlyRevenue;
public class MonthlyRevenueDto
{
    public DateTime Date { get; set; }

    public string? Month { get; set; }

    public string? Year { get; set; }

    public IReadOnlyCollection<DailyRevenueDto> DailyRevenues { get; set; } = new List<DailyRevenueDto>();
}
