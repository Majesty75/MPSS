using MPSSApi.Application.Reports.Queries.DailyPurchaseOrder;
using MPSSApi.Application.Reports.Queries.DailyRevenue;
using MPSSApi.Application.Reports.Queries.DashboardData;
using MPSSApi.Application.Reports.Queries.MonthlyRevenue;
using MPSSApi.Application.Sales.Commands.CreateSale;
using MPSSApi.Application.Sales.Queries.GetSale;
using MPSSApi.Infrastructure.Identity;

namespace MPSSApi.Web.Endpoints;
public class Reports : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
           .RequireAuthorization()
           .MapGet(GetDashboardStatastics, "dashboard")
           .MapPost(GetDailyRevenue, "daily-revenue")
           .MapPost(GetMonthlyRevenue, "monthly-revenue")
           .MapPost(GetDailyPurchaseOrder, "daily-purchase-order");
    }

    public async Task<DashboardDto> GetDashboardStatastics(ISender sender)
    {
        return await sender.Send(new DashboardDataQuery());
    }

    public async Task<MonthlyRevenueDto> GetMonthlyRevenue(ISender sender, GetMonthlyRevenueQuery query)
    {
        return await sender.Send(query);
    }

    public async Task<DailyRevenueDto> GetDailyRevenue(ISender sender, GetDailyRevenueQuery query)
    {
        return await sender.Send(query);
    }

    public async Task<DailyPurchaseOrderDto> GetDailyPurchaseOrder(ISender sender, GetDailyPurchaseOrderQuery query)
    {
        return await sender.Send(query);
    }

}
