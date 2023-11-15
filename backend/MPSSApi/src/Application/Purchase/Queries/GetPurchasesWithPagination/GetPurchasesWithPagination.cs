using MPSSApi.Application.Common.Interfaces;
using MPSSApi.Application.Common.Mappings;
using MPSSApi.Application.Common.Models;
using MPSSApi.Domain.Entities;
using MPSSApi.Domain.Enums;

namespace MPSSApi.Application.Purchases.Queries.GetPurchasesWithPagination;

public record GetPurchasesWithPaginationQuery : PaginationQuery, IRequest<PaginatedList<PurchasesDto>>;

public class GetPurchasesWithPaginationQueryValidator : AbstractValidator<GetPurchasesWithPaginationQuery>
{
    public GetPurchasesWithPaginationQueryValidator()
    {
        RuleFor(x => x.Page)
            .GreaterThanOrEqualTo(1).WithMessage("PageNumber at least greater than or equal to 1.");

        RuleFor(x => x.PageSize)
            .GreaterThanOrEqualTo(1).WithMessage("PageSize at least greater than or equal to 1.");
    }
}

public class GetPurchasesWithPaginationQueryHandler : IRequestHandler<GetPurchasesWithPaginationQuery, PaginatedList<PurchasesDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetPurchasesWithPaginationQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<PurchasesDto>> Handle(GetPurchasesWithPaginationQuery request, CancellationToken cancellationToken)
    {
        IQueryable<Purchase> purchases = _context.Purchases;

        if (request.Search != null)
        {
            purchases = purchases.Where(x => x.PurchaseNumber.Contains(request.Search));
        }

        if (SortType.Ascending.Equals(request.Sort))
        {
            purchases = purchases.OrderBy(v => v.PurchaseNumber);
        }
        else if (SortType.Descending.Equals(request.Sort))
        {
            purchases = purchases.OrderByDescending(v => v.PurchaseNumber);
        }

        return await purchases
            .ProjectTo<PurchasesDto>(_mapper.ConfigurationProvider)
            .PaginatedListAsync(request.Page, request.PageSize);
    }
}
