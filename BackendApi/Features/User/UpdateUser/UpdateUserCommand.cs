using BackendApi.Shared.Contracts;

namespace BackendApi.Features.User.UpdateUser;

public record UpdateUserCommand(
    Guid UserId,
    string? FirstName,
    string? LastName
) : ICommand;