using MPSSApi.Application.Common.Interfaces;

namespace MPSSApi.Application.Parts.Queries.GetParts;

public record GetPartsQuery : IRequest<IReadOnlyCollection<PartsDto>>;
public class GetPartsQueryValidator : AbstractValidator<GetPartsQuery>
{
    public GetPartsQueryValidator()
    {
    }
}

public class GetPartsQueryHandler : IRequestHandler<GetPartsQuery, IReadOnlyCollection<PartsDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetPartsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IReadOnlyCollection<PartsDto>> Handle(GetPartsQuery request, CancellationToken cancellationToken)
    {
        return await _context.Parts
            .ProjectTo<PartsDto>(_mapper.ConfigurationProvider)
            .ToListAsync();
    }
}
