using MPSSApi.Application.Common.Interfaces;

namespace MPSSApi.Application.Sales.Commands.DeleteSale;

public record DeleteSaleCommand(int Id) : IRequest;

public class DeleteSaleCommandValidator : AbstractValidator<DeleteSaleCommand>
{
    public DeleteSaleCommandValidator()
    {
    }
}

public class DeleteSaleCommandHandler : IRequestHandler<DeleteSaleCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteSaleCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteSaleCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Sales.Include(s => s.Records)
            .FirstOrDefaultAsync(s => s.Id == request.Id, cancellationToken);

        Guard.Against.NotFound(request.Id, entity);

        foreach (var item in entity.Records)
        {
            var part = _context.Parts.FirstOrDefault(p => p.Id == item.PartId);

            if (part != null)
            {
                // Deleting sales record means increase quantity
                part.Quantity += item.Quantity;
            }

        }

        _context.Records.RemoveRange(entity.Records);

        _context.Sales.Remove(entity);

        await _context.SaveChangesAsync(cancellationToken);
    }
}
