
using MPSSApi.Application.Common.Models;
using MPSSApi.Application.TodoLists.Commands.DeleteTodoList;
using MPSSApi.Application.TodoLists.Commands.UpdateTodoList;
using MPSSApi.Application.Vendors.Commands.CreateVendor;
using MPSSApi.Application.Vendors.Commands.UpdateVendor;
using MPSSApi.Application.Vendors.Queries;
using MPSSApi.Application.Vendors.Queries.GetVendor;
using MPSSApi.Application.Vendors.Queries.GetVendors;
using MPSSApi.Domain.Entities;

namespace MPSSApi.Web.Endpoints;
public class Vendors : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            .MapGet(GetVendors)
            .MapGet(GetVendor, "{id}")
            .MapGet(GetVendorsWithPagination, "paginate")
            .MapPost(CreateVendor)
            .MapPut(UpdateVendor, "{id}")
            .MapDelete(DeleteVendor, "{id}");
    }

    public async Task<IReadOnlyCollection<VendorDto>> GetVendors(ISender sender)
    {
        return await sender.Send(new GetVendorsQuery());
    }

    public async Task<VendorDto> GetVendor(ISender sender, int id)
    {
        return await sender.Send(new GetVendorQuery(id));
    }

    public async Task<PaginatedList<VendorDto>> GetVendorsWithPagination(ISender sender, [AsParameters] GetVendorsWithPaginationQuery query)
    {
        return await sender.Send(query);
    }

    public async Task<int> CreateVendor(ISender sender, CreateVendorCommand command)
    {
        return await sender.Send(command);
    }

    public async Task<IResult> UpdateVendor(ISender sender, int id, UpdateVendorCommand command)
    {
        if (id != command.Id) return Results.BadRequest();
        await sender.Send(command);
        return Results.NoContent();
    }

    public async Task<IResult> DeleteVendor(ISender sender, int id)
    {
        await sender.Send(new DeleteTodoListCommand(id));
        return Results.NoContent();
    }
}

