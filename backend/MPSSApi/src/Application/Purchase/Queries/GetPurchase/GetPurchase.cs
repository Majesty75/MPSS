using MPSSApi.Application.Common.Interfaces;

namespace MPSSApi.Application.Purchases.Queries.GetPurchase;

public record GetPurchaseQuery(int Id) : IRequest<PurchaseDto>;

public class GetPurchaseQueryValidator : AbstractValidator<GetPurchaseQuery>
{
    public GetPurchaseQueryValidator()
    {
    }
}

public class GetPurchaseQueryHandler : IRequestHandler<GetPurchaseQuery, PurchaseDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetPurchaseQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PurchaseDto> Handle(GetPurchaseQuery request, CancellationToken cancellationToken)
    {
        var entity = await _context.Purchases.Include(s => s.Records)
            .FirstOrDefaultAsync(s => s.Id == request.Id, cancellationToken);

        Guard.Against.NotFound(request.Id, entity);

        return _mapper.Map<PurchaseDto>(entity);
    }
}
