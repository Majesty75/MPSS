using MPSSApi.Application.Common.Interfaces;

namespace MPSSApi.Application.Purchases.Commands.DeletePurchase;

public record DeletePurchaseCommand(int Id) : IRequest;

public class DeletePurchaseCommandValidator : AbstractValidator<DeletePurchaseCommand>
{
    public DeletePurchaseCommandValidator()
    {
    }
}

public class DeletePurchaseCommandHandler : IRequestHandler<DeletePurchaseCommand>
{
    private readonly IApplicationDbContext _context;

    public DeletePurchaseCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeletePurchaseCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Purchases.Include(s => s.Records)
            .FirstOrDefaultAsync(s => s.Id == request.Id, cancellationToken);

        Guard.Against.NotFound(request.Id, entity);

        _context.Records.RemoveRange(entity.Records);

        _context.Purchases.Remove(entity);

        await _context.SaveChangesAsync(cancellationToken);
    }
}
