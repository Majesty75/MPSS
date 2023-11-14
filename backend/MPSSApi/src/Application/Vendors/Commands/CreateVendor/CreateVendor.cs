using MPSSApi.Application.Common.Interfaces;
using MPSSApi.Domain.Entities;

namespace MPSSApi.Application.Vendors.Commands.CreateVendor;

public record CreateVendorCommand : IRequest<int>
{
    public string VendorName { get; set; } = string.Empty;

    public string? Email { get; set; }

    public string? PhoneNo { get; set; }

    public string? Street { get; set; }

    public string? City { get; set; }

    public string? Zip { get; set; }

    public string? Country { get; set; }
}

public class CreateVendorCommandValidator : AbstractValidator<CreateVendorCommand>
{
    public CreateVendorCommandValidator()
    {
        RuleFor(v => v.VendorName)
            .MaximumLength(200)
            .NotEmpty()
                .WithMessage("Vendor Name Is Required")
                .WithErrorCode("Required");

        RuleFor(v => v.Email)
            .MaximumLength(50)
            .EmailAddress()
                .WithMessage("'{PropertyName}' must be valid email.")
                .WithErrorCode("Invalid");
    }
}

public class CreateVendorCommandHandler : IRequestHandler<CreateVendorCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreateVendorCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreateVendorCommand request, CancellationToken cancellationToken)
    {
        var entity = new Vendor()
        {
            VendorName = request.VendorName,
            Email = request.Email,
            PhoneNo = request.PhoneNo,
            Street = request.Street,
            City = request.City,
            Zip = request.Zip,
            Country = request.Country
        };

        _context.Vendors.Add(entity);

        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;

    }
}
