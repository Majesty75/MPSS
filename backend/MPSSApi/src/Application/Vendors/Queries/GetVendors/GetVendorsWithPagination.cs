using MPSSApi.Application.Common.Interfaces;
using MPSSApi.Application.Common.Mappings;
using MPSSApi.Application.Common.Models;
using MPSSApi.Application.Common.Security;
using MPSSApi.Domain.Entities;
using MPSSApi.Domain.Enums;

namespace MPSSApi.Application.Vendors.Queries.GetVendors;

[Authorize]
public record GetVendorsWithPaginationQuery : PaginationQuery, IRequest<PaginatedList<VendorsDto>>;

public class GetVendorsWithPaginationQueryValidator : AbstractValidator<GetVendorsWithPaginationQuery>
{
    public GetVendorsWithPaginationQueryValidator()
    {
        RuleFor(x => x.Page)
            .GreaterThanOrEqualTo(1).WithMessage("PageNumber at least greater than or equal to 1.");

        RuleFor(x => x.PageSize)
            .GreaterThanOrEqualTo(1).WithMessage("PageSize at least greater than or equal to 1.");
    }
}

public class GetVendorsWithPaginationQueryHandler : IRequestHandler<GetVendorsWithPaginationQuery, PaginatedList<VendorsDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetVendorsWithPaginationQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<VendorsDto>> Handle(GetVendorsWithPaginationQuery request, CancellationToken cancellationToken)
    {
        IQueryable<Vendor> vendors = _context.Vendors;

        if(request.Search != null)
        {
            vendors = _context.Vendors.Where(x => x.VendorName.Contains(request.Search));
        }

        if(SortType.Ascending.Equals(request.Sort))
        {
            vendors = _context.Vendors.OrderBy(v => v.VendorName);
        } 
        else if (SortType.Descending.Equals(request.Sort))
        {
            vendors = _context.Vendors.OrderByDescending(v => v.VendorName);
        }

        return await vendors
            .ProjectTo<VendorsDto>(_mapper.ConfigurationProvider)
            .PaginatedListAsync(request.Page, request.PageSize);
    }
}
