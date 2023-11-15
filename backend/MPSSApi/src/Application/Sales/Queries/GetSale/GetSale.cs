using MPSSApi.Application.Common.Interfaces;

namespace MPSSApi.Application.Sales.Queries.GetSale;

public record GetSaleQuery(int Id) : IRequest<SaleDto>;

public class GetSaleQueryValidator : AbstractValidator<GetSaleQuery>
{
    public GetSaleQueryValidator()
    {
    }
}

public class GetSaleQueryHandler : IRequestHandler<GetSaleQuery, SaleDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetSaleQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<SaleDto> Handle(GetSaleQuery request, CancellationToken cancellationToken)
    {
        var entity = await _context.Sales.Include(s => s.Records)
            .FirstOrDefaultAsync(s => s.Id == request.Id, cancellationToken);

        Guard.Against.NotFound(request.Id, entity);

        return _mapper.Map<SaleDto>(entity);
    }
}
