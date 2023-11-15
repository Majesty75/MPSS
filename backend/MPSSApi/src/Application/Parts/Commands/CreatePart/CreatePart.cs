using FluentValidation;
using MPSSApi.Application.Common.Interfaces;
using MPSSApi.Domain.Entities;

namespace MPSSApi.Application.Parts.Commands.CreatePart;

public record CreatePartCommand : IRequest<int>
{
    public string PartName { get; set; } = string.Empty;

    public string PartNumber { get; set; } = string.Empty;

    public int Quantity { get; set; }

    public decimal Cost { get; set; } = 0;

    public decimal SellPrice { get; set; } = 0;

    public int? VendorId { get; set; }
}

public class CreatePartCommandValidator : AbstractValidator<CreatePartCommand>
{
    private readonly IApplicationDbContext _context;

    public CreatePartCommandValidator(IApplicationDbContext context)
    {
        _context = context;

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

    public async Task<bool> VendorExists(CreatePartCommand model, int? id, CancellationToken cancellationToken)
    {
        return await _context.Vendors
            .AnyAsync(v => v.Id == id, cancellationToken);
    }
}

public class CreatePartCommandHandler : IRequestHandler<CreatePartCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreatePartCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreatePartCommand request, CancellationToken cancellationToken)
    {
        var entity = new Part()
        {
            PartName = request.PartName,
            PartNumber = request.PartNumber,
            Quantity = request.Quantity,
            Cost = request.Cost,
            SellPrice = request.SellPrice,
            VendorId = request.VendorId
        };

        _context.Parts.Add(entity);

        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
