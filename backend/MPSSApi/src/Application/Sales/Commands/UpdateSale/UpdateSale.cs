using MPSSApi.Application.Common.Interfaces;
using MPSSApi.Application.Common.Models;
using MPSSApi.Domain.Entities;

namespace MPSSApi.Application.Sales.Commands.UpdateSale;

public record UpdateSaleCommand : IRequest
{
    public int Id { get; set; }

    public string SaleNumber { get; set; } = string.Empty;

    public decimal Total { get; set; }

    public DateTime Date { get; set; }

    public string? CustomerName { get; set; }

    public string? CustomerContact { get; set; }

    public IList<RecordCommand> Records { get; set; } = new List<RecordCommand>();
}

public class UpdateSaleCommandValidator : AbstractValidator<UpdateSaleCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateSaleCommandValidator(IApplicationDbContext context)
    {
        _context = context;

        RuleFor(v => v.SaleNumber)
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
    }

    public async Task<bool> BeUniqueNumber(UpdateSaleCommand command, string number, CancellationToken cancellationToken)
    {
        return await _context.Sales
            .AllAsync(s => s.Id == command.Id || s.SaleNumber != number, cancellationToken);
    }
}

public class UpdateSaleCommandHandler : IRequestHandler<UpdateSaleCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public UpdateSaleCommandHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task Handle(UpdateSaleCommand request, CancellationToken cancellationToken)
    {
        var records = _mapper.Map<IList<RecordCommand>, IList<Record>>(request.Records);
        
        var entity = await _context.Sales.Include(s => s.Records)
            .FirstOrDefaultAsync(s => s.Id == request.Id, cancellationToken);

        Guard.Against.NotFound(request.Id, entity);

        entity.SaleNumber = request.SaleNumber;
        entity.Total = records.Sum(r => r.Total);
        entity.Date = request.Date;
        entity.CustomerName = request.CustomerName;
        entity.CustomerContact = request.CustomerContact;

        await _context.SaveChangesAsync(cancellationToken);


        foreach (var item in records)
        {
            item.SaleId = entity.Id;
            item.PurchaseId = null;
            item.Date = entity.Date;
        }

        var existingRecords = records.Where(r => r.Id > 0).Select(r => r.Id);

        entity.Records = entity.Records.Where(r => !existingRecords.Contains(r.Id)).ToList();

        entity.Records.Concat(records.Where(r => r.Id == 0));

        _context.Records.UpdateRange(records.Where(r => r.Id != 0));

        await _context.SaveChangesAsync(cancellationToken);
    }
}
