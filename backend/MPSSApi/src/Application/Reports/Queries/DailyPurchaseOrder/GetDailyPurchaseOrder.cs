using System.Collections.ObjectModel;
using MPSSApi.Application.Common.Interfaces;

namespace MPSSApi.Application.Reports.Queries.DailyPurchaseOrder;

public record GetDailyPurchaseOrderQuery : IRequest<DailyPurchaseOrderDto>
{
    public DateTime Date { get; set; } = DateTime.Today;
}

public class GetDailyPurchaseOrderQueryValidator : AbstractValidator<GetDailyPurchaseOrderQuery>
{
    public GetDailyPurchaseOrderQueryValidator()
    {
        RuleFor(d => d.Date)
            .NotEmpty()
            .WithMessage("{propertyName} is required");
    }
}

public class GetDailyPurchaseOrderQueryHandler : IRequestHandler<GetDailyPurchaseOrderQuery, DailyPurchaseOrderDto>
{
    private readonly IApplicationDbContext _context;

    public GetDailyPurchaseOrderQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<DailyPurchaseOrderDto> Handle(GetDailyPurchaseOrderQuery request, CancellationToken cancellationToken)
    {
        var dailyPurchaseOrderRecords = new List<DailyPurchaseOrderRecordDto>();

        var poDate = new DateTime(request.Date.Year, request.Date.Month, request.Date.Day, 0, 0, 0);

        var previousSunday = poDate.AddDays(-1 * (int)poDate.DayOfWeek).AddDays(-7);

        var previousSaturday = previousSunday.AddDays(7);

        var partsWithPreviousWeekRecords = _context.Records
            .Where(r => r.Date >= previousSunday && r.Date < previousSaturday && r.SaleId != 0)
            .GroupBy(r => r.PartId)
            .Select(g => new { 
                PartId = g.Key,
                Quantity = g.Sum(r => r.Quantity)
            });

        foreach(var partRecord in partsWithPreviousWeekRecords)
        {
            var part = await _context.Parts.Include(p => p.Vendor).FirstOrDefaultAsync(p => p.Id == partRecord.PartId && p.Quantity < partRecord.Quantity);

            if (part != null)
            {
                dailyPurchaseOrderRecords.Add(
                    new DailyPurchaseOrderRecordDto { 
                        PartId = part.Id, 
                        PartName = part.PartName,
                        Quantity = partRecord.Quantity - part.Quantity,
                        Cost = part.Cost,
                        VendorId = part.VendorId,
                        VendorName = part.Vendor.VendorName,
                        VendorAddress = $"{part.Vendor.Street}, {part.Vendor.City}, {part.Vendor.Country}, {part.Vendor.Zip}",
                        VendorContact = part.Vendor.PhoneNo ?? part.Vendor.Email
                    }
                );
            }
        }

        return new DailyPurchaseOrderDto
        {
            Date = poDate,
            DailyPurchaseOrderRecords = new ReadOnlyCollection<DailyPurchaseOrderRecordDto>(dailyPurchaseOrderRecords)
        };
    }
}
