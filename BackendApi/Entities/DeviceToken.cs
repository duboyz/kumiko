namespace BackendApi.Entities;

public class DeviceToken : BaseEntity
{
    public Guid RestaurantId { get; set; }
    public Restaurant Restaurant { get; set; } = null!;

    public string ExpoPushToken { get; set; } = string.Empty;
    public string DeviceType { get; set; } = string.Empty; // "ios" or "android"

    public DateTime LastRegisteredAt { get; set; }
}
