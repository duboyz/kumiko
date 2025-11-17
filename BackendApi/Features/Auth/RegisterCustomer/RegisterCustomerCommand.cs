using BackendApi.Models.Auth;
using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Auth.RegisterCustomer;

public record RegisterCustomerCommand(
    string Email,
    string Password,
    string FirstName,
    string LastName,
    string? PhoneNumber,
    ClientType ClientType
) : ICommand<RegisterCustomerResult>;

public record RegisterCustomerResult(
    string? AccessToken,
    string? RefreshToken,
    DateTime ExpiresAt
);

