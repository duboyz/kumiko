using BackendApi.Repositories.UserRepository;
using BackendApi.Shared.Contracts;

namespace BackendApi.Features.User.UpdateUserSettings;

public class UpdateUserSettingsHandler(IUserRepository userRepository) : ICommandHandler<UpdateUserSettingsCommand>
{
    public async Task Handle(UpdateUserSettingsCommand request, CancellationToken cancellationToken)
    {
        var user = await userRepository.GetByIdAsync(request.UserId);
        if (user == null)
        {
            throw new KeyNotFoundException("User not found");
        }

        user.PreferredLanguage = request.PreferredLanguage;
        user.UpdatedAt = DateTime.UtcNow;
        await userRepository.UpdateAsync(user);
    }
}