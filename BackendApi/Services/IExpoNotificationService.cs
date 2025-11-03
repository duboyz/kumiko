namespace BackendApi.Services;

public interface IExpoNotificationService
{
    Task SendPushNotificationAsync(string expoPushToken, string title, string body, Dictionary<string, object>? data = null);
    Task SendPushNotificationsAsync(List<string> expoPushTokens, string title, string body, Dictionary<string, object>? data = null);
}
