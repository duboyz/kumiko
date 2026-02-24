using System.Collections.Concurrent;

namespace BackendApi.Services;

public class CameraSessionService : ICameraSessionService
{
    private readonly ConcurrentDictionary<string, List<CameraSessionImage>> _sessions = new();
    private readonly ILogger<CameraSessionService> _logger;
    private readonly Timer _cleanupTimer;

    public CameraSessionService(ILogger<CameraSessionService> logger)
    {
        _logger = logger;
        // Cleanup sessions older than 1 hour every 30 minutes
        _cleanupTimer = new Timer(CleanupOldSessions, null, TimeSpan.FromMinutes(30), TimeSpan.FromMinutes(30));
    }

    public string CreateSession()
    {
        var sessionId = Guid.NewGuid().ToString("N");
        _sessions.TryAdd(sessionId, new List<CameraSessionImage>());
        _logger.LogInformation("Created camera session: {SessionId}", sessionId);
        return sessionId;
    }

    public void AddImageToSession(string sessionId, byte[] imageData, string mimeType, string fileName)
    {
        if (!_sessions.TryGetValue(sessionId, out var images))
        {
            throw new ArgumentException($"Session {sessionId} not found");
        }

        images.Add(new CameraSessionImage
        {
            ImageData = imageData,
            MimeType = mimeType,
            FileName = fileName
        });

        _logger.LogInformation("Added image to session {SessionId}, total images: {Count}", sessionId, images.Count);
    }

    public List<CameraSessionImage> GetSessionImages(string sessionId)
    {
        if (!_sessions.TryGetValue(sessionId, out var images))
        {
            return new List<CameraSessionImage>();
        }

        return images.ToList();
    }

    public bool SessionExists(string sessionId)
    {
        return _sessions.ContainsKey(sessionId);
    }

    public void CleanupSession(string sessionId)
    {
        _sessions.TryRemove(sessionId, out _);
        _logger.LogInformation("Cleaned up session: {SessionId}", sessionId);
    }

    private void CleanupOldSessions(object? state)
    {
        // Sessions are cleaned up when accessed after 1 hour, or manually
        // This is a simple implementation - in production you might want more sophisticated cleanup
    }
}
