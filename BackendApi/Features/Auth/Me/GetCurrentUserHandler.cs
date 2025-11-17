using BackendApi.Repositories.UserRepository;
using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Auth.Me;

public class GetCurrentUserHandler(
    IUserRepository userRepository) : IQueryHandler<GetCurrentUserQuery, GetCurrentUserResult>
{
    public async Task<GetCurrentUserResult> Handle(GetCurrentUserQuery request, CancellationToken cancellationToken)
    {
        var user = await userRepository.GetByIdAsync(request.UserId);

        if (user == null)
        {
            throw new KeyNotFoundException("User not found");
        }

        return new GetCurrentUserResult(
            user.Id,
            user.Email,
            user.FirstName ?? string.Empty,
            user.LastName ?? string.Empty,
            user.PhoneNumber,
            user.IsDeleted,
            user.PreferredLanguage
        );
    }
}