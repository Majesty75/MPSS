using MPSSApi.Application.Common.Interfaces;
using MPSSApi.Application.Vendors.Commands.UpdateVendor;

namespace MPSSApi.Application.Vendors.Commands.DeleteVendor;

public record DeleteVendorCommand(int Id) : IRequest;

public class DeleteVendorCommandValidator : AbstractValidator<DeleteVendorCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteVendorCommandValidator(IApplicationDbContext context)
    {
        _context = context;

        RuleFor(v => v.Id)
            .NotEqual(0)
            .MustAsync(ExistsInDB)
                .WithMessage("Vendor Does Not Exists")
                .WithErrorCode("NotExists");
    }

    public async Task<bool> ExistsInDB(DeleteVendorCommand model, int id, CancellationToken cancellationToken)
    {
        return await _context.Vendors
            .AnyAsync(v => v.Id == id, cancellationToken);
    }
}

public class DeleteVendorCommandHandler : IRequestHandler<DeleteVendorCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteVendorCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteVendorCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Vendors
            .Where(v => v.Id == request.Id)
            .SingleOrDefaultAsync(cancellationToken);

        Guard.Against.NotFound(request.Id, entity);

        _context.Vendors.Remove(entity);

        await _context.SaveChangesAsync(cancellationToken);
    }
}
