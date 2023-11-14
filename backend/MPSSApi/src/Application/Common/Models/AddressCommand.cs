namespace MPSSApi.Application.Common.Models;
public record AddressCommand
{
    public string? Street { get; set; }

    public string? City { get; set; }

    public string? Zip { get; set; }

    public string? Country { get; set; }
}
