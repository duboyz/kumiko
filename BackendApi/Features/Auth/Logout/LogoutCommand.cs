using BackendApi.Shared.Contracts;
using BackendApi.Shared.Results;

namespace BackendApi.Features.Auth.Logout;

public record LogoutCommand() : ICommand<Result>;