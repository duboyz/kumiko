using BackendApi.Shared.Contracts;
using System.ComponentModel.DataAnnotations;

namespace BackendApi.Features.Auth.ResetPassword;

public record ResetPasswordCommand(
    [Required] string Token,
    [Required][MinLength(8)] string NewPassword
) : ICommand<ResetPasswordResult>;

public record ResetPasswordResult
{
    public required string Message { get; init; }
}

