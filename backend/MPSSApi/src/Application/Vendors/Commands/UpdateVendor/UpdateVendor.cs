using MPSSApi.Application.Common.Interfaces;
using MPSSApi.Application.Common.Models;

namespace MPSSApi.Application.Vendors.Commands.UpdateVendor;

public record UpdateVendorCommand : IRequest
{
    public int Id { get; set; }

    public string VendorName { get; set; } = string.Empty;

    public string? Email { get; set; }

    public string? PhoneNo { get; set; }

    public AddressCommand? Address { get; set; }
}

public class UpdateVendorCommandValidator : AbstractValidator<UpdateVendorCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateVendorCommandValidator(IApplicationDbContext context)
    {
        _context = context;

        RuleFor(v => v.VendorName)
            .MaximumLength(200)
            .NotEmpty()
                .WithMessage("Vendor Name Is Required")
                .WithErrorCode("Required");

        RuleFor(v => v.Id)
            .NotEqual(0)
            .MustAsync(ExistsInDB)
                .WithMessage("Vendor Does Not Exists")
                .WithErrorCode("NotExists");

        RuleFor(v => v.Email)
            .MaximumLength(50)
            .EmailAddress()
                .WithMessage("'{PropertyName}' must be valid email.")
                .WithErrorCode("Invalid");
    }

    public async Task<bool> ExistsInDB(UpdateVendorCommand model, int id, CancellationToken cancellationToken)
    {
        return await _context.Vendors
            .AnyAsync(v => v.Id == id, cancellationToken);
    }
}

public class UpdateVendorCommandHandler : IRequestHandler<UpdateVendorCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateVendorCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateVendorCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Vendors
            .FindAsync(new object[] { request.Id }, cancellationToken);

        Guard.Against.NotFound(request.Id, entity);

        entity.VendorName = request.VendorName;
        entity.Email = request.Email;
        entity.PhoneNo = request.PhoneNo;
        entity.Street = request.Address?.Street;
        entity.City = request.Address?.City;
        entity.Zip = request.Address?.Zip;
        entity.Country = request.Address?.Country;

        await _context.SaveChangesAsync(cancellationToken);
    }
}
