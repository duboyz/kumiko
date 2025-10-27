namespace BackendApi.Services;

public interface ITwilioSmsService
{
    Task SendSmsAsync(string phoneNumber, string companyName, string message);
}

