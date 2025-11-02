using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Auth.ForgotPassword;

public record ForgotPasswordCommand(
    string Email
) : ICommand<ForgotPasswordResult>;

public record ForgotPasswordResult
{
    public required string Message { get; init; }
}

