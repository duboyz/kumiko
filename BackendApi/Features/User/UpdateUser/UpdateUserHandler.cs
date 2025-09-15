using BackendApi.Repositories.UserRepository;
using BackendApi.Shared.Contracts;

namespace BackendApi.Features.User.UpdateUser;

public class UpdateUserHandler(
    IUserRepository userRepository) : ICommandHandler<UpdateUserCommand>
{
    public async Task Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        var user = await userRepository.GetByIdAsync(request.UserId);

        if (user == null)
        {
            throw new KeyNotFoundException("User not found");
        }

        if (!string.IsNullOrWhiteSpace(request.FirstName))
            user.FirstName = request.FirstName;

        if (!string.IsNullOrWhiteSpace(request.LastName))
            user.LastName = request.LastName;

        user.UpdatedAt = DateTime.UtcNow;
        await userRepository.UpdateAsync(user);
    }
}