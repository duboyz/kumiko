using Expo.Server.Client;
using Expo.Server.Models;

namespace BackendApi.Services;

public class ExpoNotificationService : IExpoNotificationService
{
    private readonly PushApiClient _pushClient;
    private readonly ILogger<ExpoNotificationService> _logger;

    public ExpoNotificationService(ILogger<ExpoNotificationService> logger)
    {
        _pushClient = new PushApiClient();
        _logger = logger;
    }

    public async Task SendPushNotificationAsync(
        string expoPushToken,
        string title,
        string body,
        Dictionary<string, object>? data = null)
    {
        await SendPushNotificationsAsync(new List<string> { expoPushToken }, title, body, data);
    }

    public async Task SendPushNotificationsAsync(
        List<string> expoPushTokens,
        string title,
        string body,
        Dictionary<string, object>? data = null)
    {
        try
        {
            var pushTicketReq = new PushTicketRequest
            {
                PushTo = expoPushTokens,
                PushTitle = title,
                PushBody = body,
                PushData = data ?? new Dictionary<string, object>(),
                PushSound = "default",
                PushBadgeCount = 1,
                PushChannelId = "default"
            };

            var result = await _pushClient.PushSendAsync(pushTicketReq);

            if (result?.PushTicketErrors?.Count > 0)
            {
                foreach (var error in result.PushTicketErrors)
                {
                    _logger.LogError($"Push notification error: {error.ErrorCode} - {error.ErrorMessage}");
                }
            }

            _logger.LogInformation($"Successfully sent push notifications to {expoPushTokens.Count} devices");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send push notifications");
            throw;
        }
    }
}
