using System.ComponentModel.DataAnnotations;

namespace BackendApi.Models.Address;

public class RequestSearchAddress
{
    [Required]
    public string Query { get; set; } = string.Empty;

    public string? Country { get; set; } = "NO"; // Default to Norway
    public int Limit { get; set; } = 10;
}
