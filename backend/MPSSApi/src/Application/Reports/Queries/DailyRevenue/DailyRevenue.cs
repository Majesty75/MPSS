using MPSSApi.Application.Common.Interfaces;

namespace MPSSApi.Application.Reports.Queries.DailyRevenue;

public record GetDailyRevenueQuery : IRequest<DailyRevenueDto>
{
    public DateTime Date { get; set; }
}

public class GetDailyRevenueQueryValidator : AbstractValidator<GetDailyRevenueQuery>
{
    public GetDailyRevenueQueryValidator()
    {
        RuleFor(d => d.Date)
            .NotEmpty()
            .WithMessage("{propertyName} is required");
    }
}

public class GetDailyRevenueQueryHandler : IRequestHandler<GetDailyRevenueQuery, DailyRevenueDto>
{
    private readonly IApplicationDbContext _context;

    public GetDailyRevenueQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<DailyRevenueDto> Handle(GetDailyRevenueQuery request, CancellationToken cancellationToken)
    {
        var start = new DateTime(request.Date.Year, request.Date.Month, request.Date.Day, 0, 0, 0);
        var end = start.AddDays(1);

        var revenue = _context.Records
            .Where(r => r.SaleId != null && r.Date >= start && r.Date < end)
            .Sum(r => r.Total);

        await Task.CompletedTask;

        return new DailyRevenueDto
        {
            Date = start,
            Day = start.Day,
            Revenue = revenue
        };
    }
}
