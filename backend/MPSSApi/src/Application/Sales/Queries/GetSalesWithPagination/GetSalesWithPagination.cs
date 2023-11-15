using MPSSApi.Application.Common.Interfaces;
using MPSSApi.Application.Common.Mappings;
using MPSSApi.Application.Common.Models;
using MPSSApi.Domain.Entities;
using MPSSApi.Domain.Enums;

namespace MPSSApi.Application.Sales.Queries.GetSalesWithPagination;

public record GetSalesWithPaginationQuery : PaginationQuery, IRequest<PaginatedList<SalesDto>>;

public class GetSalesWithPaginationQueryValidator : AbstractValidator<GetSalesWithPaginationQuery>
{
    public GetSalesWithPaginationQueryValidator()
    {
        RuleFor(x => x.Page)
            .GreaterThanOrEqualTo(1).WithMessage("PageNumber at least greater than or equal to 1.");

        RuleFor(x => x.PageSize)
            .GreaterThanOrEqualTo(1).WithMessage("PageSize at least greater than or equal to 1.");
    }
}

public class GetSalesWithPaginationQueryHandler : IRequestHandler<GetSalesWithPaginationQuery, PaginatedList<SalesDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetSalesWithPaginationQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<SalesDto>> Handle(GetSalesWithPaginationQuery request, CancellationToken cancellationToken)
    {
        IQueryable<Sale> sales = _context.Sales;

        if (request.Search != null)
        {
            sales = sales.Where(x => x.SaleNumber.Contains(request.Search));
        }

        if (SortType.Ascending.Equals(request.Sort))
        {
            sales = sales.OrderBy(v => v.SaleNumber);
        }
        else if (SortType.Descending.Equals(request.Sort))
        {
            sales = sales.OrderByDescending(v => v.SaleNumber);
        }

        return await sales
            .ProjectTo<SalesDto>(_mapper.ConfigurationProvider)
            .PaginatedListAsync(request.Page, request.PageSize);
    }
}
