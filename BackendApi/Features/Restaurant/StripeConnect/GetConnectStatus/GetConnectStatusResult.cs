namespace BackendApi.Features.Restaurant.StripeConnect.GetConnectStatus;

public record GetConnectStatusResult(
    bool IsConnected,
    bool OnboardingComplete,
    bool ChargesEnabled,
    string? AccountId
);

