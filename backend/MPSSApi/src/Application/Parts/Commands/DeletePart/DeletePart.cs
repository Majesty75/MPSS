using FluentValidation;
using MPSSApi.Application.Common.Interfaces;
using MPSSApi.Application.Parts.Commands.UpdatePart;

namespace MPSSApi.Application.Parts.Commands.DeletePart;

public record DeletePartCommand(int Id) : IRequest;

public class DeletePartCommandValidator : AbstractValidator<DeletePartCommand>
{
    private readonly IApplicationDbContext _context;

    public DeletePartCommandValidator(IApplicationDbContext context)
    {
        _context = context;

        RuleFor(v => v.Id)
            .NotEqual(0)
            .MustAsync(PartExists)
                .WithMessage("Part Does Not Exists")
                .WithErrorCode("NotExists");
    }

    public async Task<bool> PartExists(DeletePartCommand model, int id, CancellationToken cancellationToken)
    {
        return await _context.Parts
            .AnyAsync(v => v.Id == id, cancellationToken);
    }
}

public class DeletePartCommandHandler : IRequestHandler<DeletePartCommand>
{
    private readonly IApplicationDbContext _context;

    public DeletePartCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeletePartCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Parts
            .Where(v => v.Id == request.Id)
            .SingleOrDefaultAsync(cancellationToken);

        Guard.Against.NotFound(request.Id, entity);

        _context.Parts.Remove(entity);

        await _context.SaveChangesAsync(cancellationToken);
    }
}
