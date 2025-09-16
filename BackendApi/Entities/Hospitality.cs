namespace BackendApi.Entities;

public class Hospitality : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string GooglePlaceId { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string Zip { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string Latitude { get; set; } = string.Empty;
    public string Longitude { get; set; } = string.Empty;
    public string? Description { get; set; }

    public ICollection<HospitalityRoom> Rooms { get; set; } = [];
}
