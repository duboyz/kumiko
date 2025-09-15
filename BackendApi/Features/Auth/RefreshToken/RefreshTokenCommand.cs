using BackendApi.Models.Auth;
using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Auth.RefreshToken;

public record RefreshTokenCommand(
    string RefreshToken,
    ClientType? ClientType = ClientType.Web
) : ICommand<RefreshTokenResult>;

public record RefreshTokenResult(
    string? AccessToken,
    string? RefreshToken,
    DateTime? ExpiresAt
);