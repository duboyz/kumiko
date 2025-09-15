namespace BackendApi.Entities;

public class Hospitality : BaseEntity
{
    public string GooglePlaceId { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string Zip { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string Latitude { get; set; } = string.Empty;
    public string Longitude { get; set; } = string.Empty;

    public ICollection<HospitalityRoom> Rooms { get; set; } = [];
    public Website? Website { get; set; }
    public Guid? WebsiteId { get; set; }
}
