using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.Auth.TestConfig;

[ApiController]
[Route("api/auth")]
public class TestConfigController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public TestConfigController(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
    {
        _configuration = configuration;
        _httpContextAccessor = httpContextAccessor;
    }

    [HttpGet("test-config")]
    public IActionResult TestConfig()
    {
        var httpContext = _httpContextAccessor.HttpContext;
        
        var config = new
        {
            Jwt = new
            {
                Secret = !string.IsNullOrEmpty(_configuration["Jwt:Secret"]),
                SecretLength = _configuration["Jwt:Secret"]?.Length ?? 0,
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"],
                AccessTokenExpiration = _configuration["Jwt:AccessTokenExpirationMinutes"],
                RefreshTokenExpiration = _configuration["Jwt:RefreshTokenExpirationDays"]
            },
            Frontend = new
            {
                BaseUrl = _configuration["Frontend:BaseUrl"]
            },
            Request = new
            {
                Scheme = httpContext?.Request.Scheme,
                Host = httpContext?.Request.Host.ToString(),
                Origin = httpContext?.Request.Headers.Origin.ToString(),
                Referer = httpContext?.Request.Headers.Referer.ToString(),
                UserAgent = httpContext?.Request.Headers.UserAgent.ToString()
            },
            Environment = new
            {
                EnvironmentName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT"),
                IsDevelopment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development"
            }
        };

        return Ok(new { success = true, data = config });
    }
}
