namespace BackendApi.Services;

public interface ICameraSessionService
{
    string CreateSession();
    void AddImageToSession(string sessionId, byte[] imageData, string mimeType, string fileName);
    List<CameraSessionImage> GetSessionImages(string sessionId);
    bool SessionExists(string sessionId);
    void CleanupSession(string sessionId);
}

public class CameraSessionImage
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public byte[] ImageData { get; set; } = [];
    public string MimeType { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
}
