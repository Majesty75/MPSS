using MPSSApi.Application.Common.Interfaces;
using MPSSApi.Application.Common.Mappings;
using MPSSApi.Application.Common.Models;
using MPSSApi.Application.Common.Security;
using MPSSApi.Domain.Entities;
using MPSSApi.Domain.Enums;

namespace MPSSApi.Application.Vendors.Queries.GetVendors;

[Authorize]
public record GetVendorsQuery : IRequest<IReadOnlyCollection<VendorsDto>>;

public class GetVendorsQueryValidator : AbstractValidator<GetVendorsQuery>
{
    public GetVendorsQueryValidator()
    {
    }
}

public class GetVendorsQueryHandler : IRequestHandler<GetVendorsQuery, IReadOnlyCollection<VendorsDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetVendorsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IReadOnlyCollection<VendorsDto>> Handle(GetVendorsQuery request, CancellationToken cancellationToken)
    {
        return await _context.Vendors
            .ProjectTo<VendorsDto>(_mapper.ConfigurationProvider)
            .ToListAsync();
    }
}
