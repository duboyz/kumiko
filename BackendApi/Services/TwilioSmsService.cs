using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

namespace BackendApi.Services;

public class TwilioSmsService : ITwilioSmsService
{
    private readonly string _accountSid;
    private readonly string _authToken;

    public TwilioSmsService(IConfiguration configuration)
    {
        _accountSid = configuration["Twilio:AccountSid"]
            ?? throw new ArgumentNullException("Twilio:AccountSid", "Twilio Account SID is not configured");
        _authToken = configuration["Twilio:AuthToken"]
            ?? throw new ArgumentNullException("Twilio:AuthToken", "Twilio Auth Token is not configured");

        TwilioClient.Init(_accountSid, _authToken);
    }

    public async Task SendSmsAsync(string phoneNumber, string companyName, string message)
    {
        try
        {
            if (!phoneNumber.StartsWith("+47"))
            {
                phoneNumber = $"+47{phoneNumber}";
            }

            companyName = companyName.ToUpper().Substring(0, 11);

            var messageResource = await MessageResource.CreateAsync(
                to: new PhoneNumber(phoneNumber),
                from: companyName,
                body: $"{message}"
            );

            Console.WriteLine($"SMS sent successfully. SID: {messageResource.Sid}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Failed to send SMS: {ex.Message}");
            throw;
        }
    }
}

