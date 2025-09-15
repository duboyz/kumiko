using BackendApi.Models.Auth;
using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Auth.Login;

public record LoginCommand(
    string Email,
    string Password,
    ClientType? ClientType = ClientType.Web
) : ICommand<LoginResult>;

public record LoginResult(
    string? AccessToken,
    string? RefreshToken,
    DateTime? ExpiresAt
);