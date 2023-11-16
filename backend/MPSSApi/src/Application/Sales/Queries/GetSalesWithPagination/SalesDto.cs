using MPSSApi.Application.Sales.Queries.GetSale;
using MPSSApi.Domain.Entities;

namespace MPSSApi.Application.Sales.Queries.GetSalesWithPagination;
public class SalesDto
{
    public int id { get; set; }

    public string? SaleNumber { get; set; }

    public decimal Total { get; set; }

    public string? CustomerName { get; set; }

    public string? CustomerContact { get; set; }

    public DateTime Date { get; set; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Sale, SalesDto>();
        }
    }
}
