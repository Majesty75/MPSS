
using MPSSApi.Application.Common.Models;
using MPSSApi.Application.TodoLists.Commands.DeleteTodoList;
using MPSSApi.Application.Parts.Commands.CreatePart;
using MPSSApi.Application.Parts.Commands.UpdatePart;
using MPSSApi.Application.Parts.Queries.GetPart;
using MPSSApi.Application.Parts.Queries.GetParts;
using MPSSApi.Application.Parts.Queries.GetPartsWithPagination;
using MPSSApi.Application.Parts.Commands.DeletePart;

namespace MPSSApi.Web.Endpoints;
public class Parts : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            .MapGet(GetPart, "{id}")
            .MapGet(GetParts)
            .MapGet(GetPartsWithPagination, "paginate")
            .MapPost(CreatePart)
            .MapPut(UpdatePart, "{id}")
            .MapDelete(DeletePart, "{id}");
    }

    public async Task<PartDto> GetPart(ISender sender, int id)
    {
        return await sender.Send(new GetPartQuery(id));
    }

    public async Task<IReadOnlyCollection<PartsDto>> GetParts(ISender sender)
    {
        return await sender.Send(new GetPartsQuery());
    }

    public async Task<PaginatedList<PartsDto>> GetPartsWithPagination(ISender sender, [AsParameters] GetPartsWithPaginationQuery query)
    {
        return await sender.Send(query);
    }

    public async Task<int> CreatePart(ISender sender, CreatePartCommand command)
    {
        return await sender.Send(command);
    }

    public async Task<IResult> UpdatePart(ISender sender, int id, UpdatePartCommand command)
    {
        command.Id = id;
        await sender.Send(command);
        return Results.Ok(new { message = "Part Updated" });
    }

    public async Task<IResult> DeletePart(ISender sender, int id)
    {
        await sender.Send(new DeletePartCommand(id));
        return Results.Ok(new { message = "Part Deleted" });
    }
}

