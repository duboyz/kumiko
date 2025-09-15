using BackendApi.Shared.Contracts;
using BackendApi.Shared.Results;

namespace BackendApi.Features.Auth.Logout;

public class LogoutHandler(
    IHttpContextAccessor httpContextAccessor) : ICommandHandler<LogoutCommand, Result>
{
    public async Task<Result> Handle(LogoutCommand request, CancellationToken cancellationToken)
    {
        var httpContext = httpContextAccessor.HttpContext;
        if (httpContext != null)
        {
            httpContext.Response.Cookies.Delete("AccessToken");
            httpContext.Response.Cookies.Delete("RefreshToken");
        }

        await Task.CompletedTask;
        return Result.Success();
    }
}