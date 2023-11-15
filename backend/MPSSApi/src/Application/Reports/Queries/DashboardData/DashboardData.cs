using MPSSApi.Application.Common.Interfaces;

namespace MPSSApi.Application.Reports.Queries.DashboardData;

public record DashboardDataQuery : IRequest<DashboardDto>
{
    public DateTime Date { get; set; } = DateTime.Today;
}

public class DashboardDataQueryValidator : AbstractValidator<DashboardDataQuery>
{
    public DashboardDataQueryValidator()
    {
    }
}

public class DashboardDataQueryHandler : IRequestHandler<DashboardDataQuery, DashboardDto>
{
    private readonly IApplicationDbContext _context;

    public DashboardDataQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardDto> Handle(DashboardDataQuery request, CancellationToken cancellationToken)
    {
        var start = request.Date;
        var end = start.AddDays(1);

        var monthStart = new DateTime(start.Year, start.Month, 1, 0, 0 ,0);
        var monthEnd = monthStart.AddMonths(1);

        var dayRecords = _context.Records.Where(r => r.Date >= start && r.Date < end);
        var monthRecords = _context.Records.Where(r => r.Date >= monthStart && r.Date < monthEnd);

        var dailySales = dayRecords.Where(r => r.SaleId != null).Sum(r => r.Total);   
        var dailyPurchases = dayRecords.Where(r => r.PurchaseId != null).Sum(r => r.Total);

        var monthlySales = monthRecords.Where(r => r.SaleId != null).Sum(r => r.Total);
        var monthlyPurchases = monthRecords.Where(r => r.PurchaseId != null).Sum(r => r.Total);

        await Task.CompletedTask;

        return new DashboardDto
        {
            DailyPurchases = dailyPurchases,
            DailySales = dailySales,
            MonthlyPurchases = monthlyPurchases,
            MonthlySales = monthlySales
        };
    }
}
