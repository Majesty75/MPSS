using MPSSApi.Application.Common.Interfaces;
using MPSSApi.Application.Vendors.Queries.GetVendors;

namespace MPSSApi.Application.Vendors.Queries.GetVendor;

public record GetVendorQuery(int Id) : IRequest<VendorDto>;

public class GetVendorQueryValidator : AbstractValidator<GetVendorQuery>
{
    public GetVendorQueryValidator()
    {
    }
}

public class GetVendorQueryHandler : IRequestHandler<GetVendorQuery, VendorDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetVendorQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<VendorDto> Handle(GetVendorQuery request, CancellationToken cancellationToken)
    {
        var entity = await _context.Vendors
            .FindAsync(new object[] { request.Id }, cancellationToken);

        Guard.Against.NotFound(request.Id, entity);

        return _mapper.Map<VendorDto>(entity);
    }
}
