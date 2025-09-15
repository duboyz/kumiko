using BackendApi.Models.Auth;
using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Auth.Register;

public record RegisterCommand(
    string Email,
    string Password,
    string? FirstName,
    string? LastName,
    ClientType? ClientType = ClientType.Web
) : ICommand<RegisterResult>;

public record RegisterResult(
    string? AccessToken,
    string? RefreshToken,
    DateTime? ExpiresAt
);