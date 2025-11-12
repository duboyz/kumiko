using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Subscription.InitializeTrialForExistingUsers;

public record InitializeTrialForExistingUsersCommand() : ICommand<InitializeTrialForExistingUsersResult>;

public record InitializeTrialForExistingUsersResult(
    bool Success,
    string Message,
    int UsersUpdated
);