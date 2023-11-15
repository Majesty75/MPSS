using MPSSApi.Application.Common.Interfaces;
using MPSSApi.Application.Common.Models;
using MPSSApi.Domain.Entities;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace MPSSApi.Application.Purchases.Commands.UpdatePurchase;

public record UpdatePurchaseCommand : IRequest
{
    public int Id { get; set; }

    public string PurchaseNumber { get; set; } = string.Empty;

    public DateTime Date { get; set; }

    public int vendorId { get; set; }

    public IList<RecordCommand> Records { get; set; } = new List<RecordCommand>();
}

public class UpdatePurchaseCommandValidator : AbstractValidator<UpdatePurchaseCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdatePurchaseCommandValidator(IApplicationDbContext context)
    {
        _context = context;

        RuleFor(v => v.PurchaseNumber)
            .NotEmpty()
            .MaximumLength(20)
            .MustAsync(BeUniqueNumber)
                .WithMessage("'{PropertyName}' must be unique.")
                .WithErrorCode("Unique");

        RuleFor(v => v.Date)
            .NotNull()
                .WithMessage("'{PropertyName}' is required.")
                .WithErrorCode("Invalid");

        RuleFor(v => v.Records)
            .NotEmpty()
                .WithMessage("'{PropertyName}' is required.")
                .WithErrorCode("Invalid");

        RuleFor(v => v.vendorId)
            .NotEqual(0)
            .MustAsync(ExistsInDB)
                .WithMessage("Vendor Does Not Exists")
                .WithErrorCode("NotExists");
    }

    public async Task<bool> BeUniqueNumber(UpdatePurchaseCommand command, string number, CancellationToken cancellationToken)
    {
        return await _context.Purchases
            .AllAsync(p => p.Id == command.Id || p.PurchaseNumber != number, cancellationToken);
    }

    public async Task<bool> ExistsInDB(int id, CancellationToken cancellationToken)
    {
        return await _context.Vendors
            .AnyAsync(v => v.Id == id, cancellationToken);
    }
}

public class UpdatePurchaseCommandHandler : IRequestHandler<UpdatePurchaseCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public UpdatePurchaseCommandHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task Handle(UpdatePurchaseCommand request, CancellationToken cancellationToken)
    {
        var records = _mapper.Map<IList<RecordCommand>, IList<Record>>(request.Records);
        
        var entity = await _context.Purchases.Include(p => p.Records)
            .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

        Guard.Against.NotFound(request.Id, entity);

        entity.PurchaseNumber = request.PurchaseNumber;
        entity.Total = records.Sum(r => r.Total);
        entity.Date = request.Date;
        entity.VendorId = request.vendorId;


        foreach (var item in records)
        {
            item.SaleId = null;
            item.PurchaseId = entity.Id;
            item.Date = entity.Date;
        }

        var existingRecords = records.Where(r => r.Id > 0).Select(r => r.Id);

        _context.Records.RemoveRange(entity.Records.Where(r => !existingRecords.Contains(r.Id)));

        _context.Records.AddRange(records.Where(r => r.Id == 0));

        _context.Records.UpdateRange(records.Where(r => r.Id != 0));

        await _context.SaveChangesAsync(cancellationToken);
    }
}
