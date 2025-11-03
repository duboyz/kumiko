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
            var cookieOptions = new CookieOptions
            {
                Domain = GetCookieDomain(httpContext),
                Secure = true,
                SameSite = SameSiteMode.None
            };

            httpContext.Response.Cookies.Delete("AccessToken", cookieOptions);
            httpContext.Response.Cookies.Delete("RefreshToken", cookieOptions);
        }

        await Task.CompletedTask;
        return Result.Success();
    }

    private static string? GetCookieDomain(HttpContext httpContext)
    {
        var host = httpContext.Request.Host.Host;

        if (host is "localhost" or "127.0.0.1")
            return null;

        if (host.EndsWith(".kumiko.no") || host == "kumiko.no")
            return ".kumiko.no";

        return null;
    }
}