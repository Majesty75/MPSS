using Microsoft.EntityFrameworkCore;
using MPSSApi.Application.Common.Interfaces;
using MPSSApi.Application.Common.Models;
using MPSSApi.Application.Vendors.Commands.UpdateVendor;
using MPSSApi.Domain.Entities;

namespace MPSSApi.Application.Purchases.Commands.CreatePurchase;

public record CreatePurchaseCommand : IRequest<int>
{
    public string PurchaseNumber { get; set; } = string.Empty;

    public DateTime Date { get; set; }

    public int vendorId { get; set; }

    public IList<RecordCommand> Records { get; set; } = new List<RecordCommand>();
}

public class CreatePurchaseCommandValidator : AbstractValidator<CreatePurchaseCommand>
{
    private readonly IApplicationDbContext _context;

    public CreatePurchaseCommandValidator(IApplicationDbContext context)
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

    public async Task<bool> BeUniqueNumber(string number, CancellationToken cancellationToken)
    {
        return await _context.Purchases
            .AllAsync(s => s.PurchaseNumber != number, cancellationToken);
    }
    public async Task<bool> ExistsInDB(int id, CancellationToken cancellationToken)
    {
        return await _context.Vendors
            .AnyAsync(v => v.Id == id, cancellationToken);
    }
}

public class CreatePurchaseCommandHandler : IRequestHandler<CreatePurchaseCommand, int>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public CreatePurchaseCommandHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<int> Handle(CreatePurchaseCommand request, CancellationToken cancellationToken)
    {
        var records = _mapper.Map<IList<RecordCommand>, IList<Record>>(request.Records).ToList();

        var entity = new Purchase
        {
            PurchaseNumber = request.PurchaseNumber,
            Total = records.Sum(r => r.Total),
            VendorId = request.vendorId,
            Date = request.Date
        };

        _context.Purchases.Add(entity);

        await _context.SaveChangesAsync(cancellationToken);

        entity.Records = records;

        foreach (var item in entity.Records)
        {
            item.SaleId = null;
            item.PurchaseId = entity.Id;
            item.Date = entity.Date;
        }

        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
