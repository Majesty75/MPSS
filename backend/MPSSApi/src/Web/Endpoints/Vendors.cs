
using MPSSApi.Application.Common.Models;
using MPSSApi.Application.TodoLists.Commands.DeleteTodoList;
using MPSSApi.Application.Vendors.Commands.CreateVendor;
using MPSSApi.Application.Vendors.Commands.UpdateVendor;
using MPSSApi.Application.Vendors.Queries.GetVendor;
using MPSSApi.Application.Vendors.Queries.GetVendors;

namespace MPSSApi.Web.Endpoints;
public class Vendors : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            .MapGet(GetVendor, "{id}")
            .MapGet(GetVendors)
            .MapGet(GetVendorsWithPagination, "paginate")
            .MapPost(CreateVendor)
            .MapPut(UpdateVendor, "{id}")
            .MapDelete(DeleteVendor, "{id}");
    }

    public async Task<VendorDto> GetVendor(ISender sender, int id)
    {
        return await sender.Send(new GetVendorQuery(id));
    }

    public async Task<IReadOnlyCollection<VendorsDto>> GetVendors(ISender sender)
    {
        return await sender.Send(new GetVendorsQuery());
    }

    public async Task<PaginatedList<VendorsDto>> GetVendorsWithPagination(ISender sender, [AsParameters] GetVendorsWithPaginationQuery query)
    {
        return await sender.Send(query);
    }

    public async Task<int> CreateVendor(ISender sender, CreateVendorCommand command)
    {
        return await sender.Send(command);
    }

    public async Task<IResult> UpdateVendor(ISender sender, int id, UpdateVendorCommand command)
    {
        command.Id = id;
        await sender.Send(command);
        return Results.Ok(new { message = "Vendor Updated" });
    }

    public async Task<IResult> DeleteVendor(ISender sender, int id)
    {
        await sender.Send(new DeleteTodoListCommand(id));
        return Results.Ok(new { message = "Vendor Deleted" });
    }
}

