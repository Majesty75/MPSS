using System.Globalization;
using MPSSApi.Application.Common.Interfaces;
using MPSSApi.Application.Reports.Queries.DailyRevenue;
using System.Collections.ObjectModel;

namespace MPSSApi.Application.Reports.Queries.MonthlyRevenue;

public record GetMonthlyRevenueQuery : IRequest<MonthlyRevenueDto>
{
    public DateTime Date { get; set; }
}

public class GetMonthlyRevenueQueryValidator : AbstractValidator<GetMonthlyRevenueQuery>
{
    public GetMonthlyRevenueQueryValidator()
    {
        RuleFor(d => d.Date)
            .NotEmpty()
            .WithMessage("{propertyName} is required");
    }
}

public class GetMonthlyRevenueQueryHandler : IRequestHandler<GetMonthlyRevenueQuery, MonthlyRevenueDto>
{
    private readonly IApplicationDbContext _context;

    public GetMonthlyRevenueQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<MonthlyRevenueDto> Handle(GetMonthlyRevenueQuery request, CancellationToken cancellationToken)
    {
        var dailyRevenues = new List<DailyRevenueDto>();
        var start = new DateTime(request.Date.Year, request.Date.Month, 1, 0, 0, 0);
        var month = start.Month;

        while (start.Month == month && start <= DateTime.Today)
        {
            var end = start.AddDays(1);

            var revenue = _context.Records
                .Where(r => r.SaleId != null && r.Date >= start && r.Date < end)
                .Sum(r => r.Total);

            dailyRevenues.Add(new DailyRevenueDto
            {
                Date = start,
                Day = start.Day,
                Revenue = revenue
            });

            start = end;
        }

        await Task.CompletedTask;

        return new MonthlyRevenueDto
        {
            Date = request.Date,
            Month = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(request.Date.Month),
            Year = request.Date.Year.ToString(),
            DailyRevenues = new ReadOnlyCollection<DailyRevenueDto>(dailyRevenues)
        };
    }
}
