
using MPSSApi.Application.Common.Models;
using MPSSApi.Application.TodoLists.Commands.DeleteTodoList;
using MPSSApi.Application.Purchases.Commands.CreatePurchase;
using MPSSApi.Application.Purchases.Commands.UpdatePurchase;
using MPSSApi.Application.Purchases.Queries.GetPurchase;
using MPSSApi.Application.Purchases.Queries.GetPurchasesWithPagination;
using MPSSApi.Application.Purchases.Commands.DeletePurchase;

namespace MPSSApi.Web.Endpoints;
public class Purchases : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            .MapGet(GetPurchase, "{id}")
            .MapGet(GetPurchasesWithPagination, "paginate")
            .MapPost(CreatePurchase)
            .MapPut(UpdatePurchase, "{id}")
            .MapDelete(DeletePurchase, "{id}");
    }

    public async Task<PurchaseDto> GetPurchase(ISender sender, int id)
    {
        return await sender.Send(new GetPurchaseQuery(id));
    }

    public async Task<PaginatedList<PurchasesDto>> GetPurchasesWithPagination(ISender sender, [AsParameters] GetPurchasesWithPaginationQuery query)
    {
        return await sender.Send(query);
    }

    public async Task<int> CreatePurchase(ISender sender, CreatePurchaseCommand command)
    {
        return await sender.Send(command);
    }

    public async Task<IResult> UpdatePurchase(ISender sender, int id, UpdatePurchaseCommand command)
    {
        command.Id = id;
        await sender.Send(command);
        return Results.Ok(new { message = "Purchase Updated" });
    }

    public async Task<IResult> DeletePurchase(ISender sender, int id)
    {
        await sender.Send(new DeletePurchaseCommand(id));
        return Results.Ok(new { message = "Purchase Deleted" });
    }
}

