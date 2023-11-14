using MPSSApi.Application.Common.Interfaces;
using MPSSApi.Application.Vendors.Queries.GetVendor;

namespace MPSSApi.Application.Parts.Queries.GetPart;

public record GetPartQuery(int Id) : IRequest<PartDto>;

public class GetPartQueryValidator : AbstractValidator<GetPartQuery>
{
    public GetPartQueryValidator()
    {
    }
}

public class GetPartQueryHandler : IRequestHandler<GetPartQuery, PartDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetPartQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PartDto> Handle(GetPartQuery request, CancellationToken cancellationToken)
    {
        var entity = await _context.Parts
            .FindAsync(new object[] { request.Id }, cancellationToken);

        Guard.Against.NotFound(request.Id, entity);

        return _mapper.Map<PartDto>(entity);
    }
}
