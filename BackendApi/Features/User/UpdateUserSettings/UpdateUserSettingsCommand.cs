using BackendApi.Entities;
using BackendApi.Shared.Contracts;

namespace BackendApi.Features.User.UpdateUserSettings;

public record UpdateUserSettingsCommand(
    Guid UserId,
    Language PreferredLanguage
) : ICommand;