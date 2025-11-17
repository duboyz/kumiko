using BackendApi.Entities;
using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Auth.Me;

public record GetCurrentUserQuery(
    Guid UserId
) : IQuery<GetCurrentUserResult>;

public record GetCurrentUserResult(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    string? PhoneNumber,
    bool IsDeleted,
    Language PreferredLanguage
);