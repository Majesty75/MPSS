using MPSSApi.Application.Common.Interfaces;

namespace MPSSApi.Application.Parts.Commands.UpdatePart;

public record UpdatePartCommand : IRequest
{
    public int Id { get; set; }

    public string PartName { get; set; } = string.Empty;

    public string PartNumber { get; set; } = string.Empty;

    public decimal Cost { get; set; } = 0;

    public decimal SellPrice { get; set; } = 0;

    public int? VendorId { get; set; }
}

public class UpdatePartCommandValidator : AbstractValidator<UpdatePartCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdatePartCommandValidator(IApplicationDbContext context)
    {
        _context = context;

        RuleFor(v => v.Id)
            .NotEqual(0)
            .MustAsync(PartExists)
                .WithMessage("Part Does Not Exists")
                .WithErrorCode("NotExists");

        RuleFor(v => v.PartName)
            .MaximumLength(200)
            .NotEmpty()
                .WithMessage("'{PropertyName}' Is Required")
                .WithErrorCode("Required");

        RuleFor(v => v.PartNumber)
            .MaximumLength(50)
            .NotEmpty()
                .WithMessage("'{PropertyName}' Is Required")
                .WithErrorCode("Required");

        RuleFor(v => v.Cost)
            .GreaterThan(0)
                .WithMessage("'{PropertyName}' Must Be Greater Than Zero")
                .WithErrorCode("Invalid");

        RuleFor(v => v.SellPrice)
            .GreaterThan(0)
                .WithMessage("'{PropertyName}' Must Be Greater Than Zero")
                .WithErrorCode("Invalid");

        RuleFor(v => v.VendorId)
            .NotNull()
                .WithMessage("'{PropertyName}' Is Required")
                .WithErrorCode("Required");

        RuleFor(v => v.VendorId)
            .NotEqual(0)
            .MustAsync(VendorExists)
                .WithMessage("Vendor Does Not Exists")
                .WithErrorCode("NotExists");
    }

    public async Task<bool> PartExists(UpdatePartCommand model, int id, CancellationToken cancellationToken)
    {
        return await _context.Parts
            .AnyAsync(v => v.Id == id, cancellationToken);
    }

    public async Task<bool> VendorExists(UpdatePartCommand model, int? id, CancellationToken cancellationToken)
    {
        return await _context.Vendors
            .AnyAsync(v => v.Id == id, cancellationToken);
    }

}

public class UpdatePartCommandHandler : IRequestHandler<UpdatePartCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdatePartCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdatePartCommand request, CancellationToken cancellationToken)
    {

        var entity = await _context.Parts
            .FindAsync(new object[] { request.Id }, cancellationToken);

        Guard.Against.NotFound(request.Id, entity);

        entity.PartName = request.PartName;
        entity.PartNumber = request.PartNumber;
        entity.Cost = request.Cost;
        entity.SellPrice = request.SellPrice;
        entity.VendorId = request.VendorId;

        await _context.SaveChangesAsync(cancellationToken);
    }
}
