using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Subscription.InitializeTrial;

public record InitializeTrialCommand() : ICommand<InitializeTrialResult>;

public record InitializeTrialResult(
    bool Success,
    string Message
);
