namespace BackendApi.Features.Restaurant.StripeConnect.RefreshConnectStatus;

public record RefreshConnectStatusResult(
    bool Success,
    bool OnboardingComplete,
    bool ChargesEnabled,
    string? ErrorMessage
);

