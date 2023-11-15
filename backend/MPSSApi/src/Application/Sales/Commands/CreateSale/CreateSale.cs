using Microsoft.EntityFrameworkCore;
using MPSSApi.Application.Common.Interfaces;
using MPSSApi.Application.Common.Models;
using MPSSApi.Application.Sales.Queries.GetSalesWithPagination;
using MPSSApi.Domain.Entities;

namespace MPSSApi.Application.Sales.Commands.CreateSale;

public record CreateSaleCommand : IRequest<int>
{
    public string SaleNumber { get; set; } = string.Empty;

    public DateTime Date { get; set; }

    public string? CustomerName { get; set; }

    public string? CustomerContact { get; set; }

    public IList<RecordCommand> Records { get; set; } = new List<RecordCommand>();
}

public class CreateSaleCommandValidator : AbstractValidator<CreateSaleCommand>
{
    private readonly IApplicationDbContext _context;

    public CreateSaleCommandValidator(IApplicationDbContext context)
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

    public async Task<bool> BeUniqueNumber(string number, CancellationToken cancellationToken)
    {
        return await _context.Sales
            .AllAsync(s => s.SaleNumber != number, cancellationToken);
    }
}

public class CreateSaleCommandHandler : IRequestHandler<CreateSaleCommand, int>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public CreateSaleCommandHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<int> Handle(CreateSaleCommand request, CancellationToken cancellationToken)
    {
        var records = _mapper.Map<IList<RecordCommand>, IList<Record>>(request.Records).ToList();

        var entity = new Sale
        {
            SaleNumber = request.SaleNumber,
            Total = records.Sum(r => r.Total),
            CustomerName = request.CustomerName,
            CustomerContact = request.CustomerContact,
            Date = request.Date
        };

        _context.Sales.Add(entity);

        await _context.SaveChangesAsync(cancellationToken);

        entity.Records = records; 

        foreach (var item in entity.Records)
        {
            item.SaleId = entity.Id;
            item.PurchaseId = null;
            item.Date = entity.Date;

            var part = _context.Parts.FirstOrDefault(p => p.Id == item.PartId);

            if(part != null)
            {
                // Creating sales record means decrease quantity
                part.Quantity -= item.Quantity;

                if (part.Quantity < 0) part.Quantity = 0;
            }

        }

        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
