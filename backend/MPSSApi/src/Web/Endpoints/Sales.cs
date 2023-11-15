
using MPSSApi.Application.Common.Models;
using MPSSApi.Application.TodoLists.Commands.DeleteTodoList;
using MPSSApi.Application.Sales.Commands.CreateSale;
using MPSSApi.Application.Sales.Commands.UpdateSale;
using MPSSApi.Application.Sales.Queries.GetSale;
using MPSSApi.Application.Sales.Queries.GetSalesWithPagination;

namespace MPSSApi.Web.Endpoints;
public class Sales : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            .MapGet(GetSale, "{id}")
            .MapGet(GetSalesWithPagination, "paginate")
            .MapPost(CreateSale)
            .MapPut(UpdateSale, "{id}")
            .MapDelete(DeleteSale, "{id}");
    }

    public async Task<SaleDto> GetSale(ISender sender, int id)
    {
        return await sender.Send(new GetSaleQuery(id));
    }

    public async Task<PaginatedList<SalesDto>> GetSalesWithPagination(ISender sender, [AsParameters] GetSalesWithPaginationQuery query)
    {
        return await sender.Send(query);
    }

    public async Task<int> CreateSale(ISender sender, CreateSaleCommand command)
    {
        return await sender.Send(command);
    }

    public async Task<IResult> UpdateSale(ISender sender, int id, UpdateSaleCommand command)
    {
        command.Id = id;
        await sender.Send(command);
        return Results.Ok(new { message = "Sale Updated" });
    }

    public async Task<IResult> DeleteSale(ISender sender, int id)
    {
        await sender.Send(new DeleteTodoListCommand(id));
        return Results.Ok(new { message = "Sale Deleted" });
    }
}

