namespace BackendApi.Models.Address;

public class ResponseBusinessDetails
{
    public string PlaceId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string FormattedAddress { get; set; } = string.Empty;
    public string FormattedPhoneNumber { get; set; } = string.Empty;
    public string InternationalPhoneNumber { get; set; } = string.Empty;
    public string Website { get; set; } = string.Empty;
    public string BusinessStatus { get; set; } = string.Empty;
    public List<string> Types { get; set; } = new();
    public double? Rating { get; set; }
    public int? UserRatingsTotal { get; set; }
    public int? PriceLevel { get; set; }
    public string Vicinity { get; set; } = string.Empty;
    public BusinessOpeningHours? OpeningHours { get; set; }
    public BusinessGeometry Geometry { get; set; } = new();
    public List<BusinessPhoto> Photos { get; set; } = new();
    public List<BusinessReview> Reviews { get; set; } = new();
}

public class BusinessOpeningHours
{
    public bool OpenNow { get; set; }
    public List<string> WeekdayText { get; set; } = new();
}

public class BusinessGeometry
{
    public BusinessLocation Location { get; set; } = new();
}

public class BusinessLocation
{
    public double Lat { get; set; }
    public double Lng { get; set; }
}

public class BusinessPhoto
{
    public string PhotoReference { get; set; } = string.Empty;
    public int Height { get; set; }
    public int Width { get; set; }
}

public class BusinessReview
{
    public string AuthorName { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string Text { get; set; } = string.Empty;
    public long Time { get; set; }
}
