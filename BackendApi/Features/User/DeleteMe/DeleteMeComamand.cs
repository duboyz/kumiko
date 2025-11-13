using BackendApi.Shared.Contracts;

namespace BackendApi.Features.User.DeleteMe;

public record DeleteMeCommand(
    Guid UserId,
    string Email,
    string Password
) : ICommand;


