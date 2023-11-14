namespace MPSSApi.Application.Common.Models;
public record PaginationQuery
{
    public int Page { get; set; }

    public int PageSize { get; set; }

    public string? Sort { get; set; }

    public string? Search { get; set; }
}
