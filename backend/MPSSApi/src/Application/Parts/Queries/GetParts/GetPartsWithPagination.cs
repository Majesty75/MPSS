using MPSSApi.Application.Common.Interfaces;
using MPSSApi.Application.Common.Mappings;
using MPSSApi.Application.Common.Models;
using MPSSApi.Application.Parts.Queries.GetParts;
using MPSSApi.Application.Vendors.Queries.GetVendors;
using MPSSApi.Domain.Entities;
using MPSSApi.Domain.Enums;

namespace MPSSApi.Application.Parts.Queries.GetPartsWithPagination;

public record GetPartsWithPaginationQuery : PaginationQuery, IRequest<PaginatedList<PartsDto>>;
public class GetPartsWithPaginationQueryValidator : AbstractValidator<GetPartsWithPaginationQuery>
{
    public GetPartsWithPaginationQueryValidator()
    {
        RuleFor(x => x.Page)
            .GreaterThanOrEqualTo(1).WithMessage("PageNumber at least greater than or equal to 1.");

        RuleFor(x => x.PageSize)
            .GreaterThanOrEqualTo(1).WithMessage("PageSize at least greater than or equal to 1.");
    }
}

public class GetPartsWithPaginationQueryHandler : IRequestHandler<GetPartsWithPaginationQuery, PaginatedList<PartsDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetPartsWithPaginationQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<PartsDto>> Handle(GetPartsWithPaginationQuery request, CancellationToken cancellationToken)
    {
        IQueryable<Part> parts = _context.Parts;

        if (request.Search != null)
        {
            parts = parts.Where(x => x.PartName.Contains(request.Search));
        }

        if (SortType.Ascending.Equals(request.Sort))
        {
            parts = parts.OrderBy(v => v.PartName);
        }
        else if (SortType.Descending.Equals(request.Sort))
        {
            parts = parts.OrderByDescending(v => v.PartName);
        }

        return await parts
            .ProjectTo<PartsDto>(_mapper.ConfigurationProvider)
            .PaginatedListAsync(request.Page, request.PageSize);
    }
}
