using System.Security.Cryptography;
using BackendApi.Data;
using BackendApi.Services;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.Auth.ForgotPassword;

public class ForgotPasswordHandler(
    ApplicationDbContext context,
    IEmailService emailService) : ICommandHandler<ForgotPasswordCommand, ForgotPasswordResult>
{
    public async Task<ForgotPasswordResult> Handle(ForgotPasswordCommand request, CancellationToken cancellationToken)
    {
        // Find user by email
        var user = await context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email.ToLower(), cancellationToken);

        // Always return success to prevent email enumeration
        // If user doesn't exist, we still return success but don't send email
        if (user == null)
        {
            // Add a small delay to prevent timing attacks
            await Task.Delay(200, cancellationToken);
            return new ForgotPasswordResult
            {
                Message = "If an account exists with that email, a password reset link has been sent."
            };
        }

        // Generate secure reset token
        var resetToken = GenerateResetToken();

        // Store hashed token in database
        user.PasswordResetToken = HashToken(resetToken);
        user.PasswordResetTokenExpiresAt = DateTime.UtcNow.AddHours(1); // Token expires in 1 hour

        await context.SaveChangesAsync(cancellationToken);

        // Send password reset email
        var userName = user.FirstName ?? user.Email.Split('@')[0];
        await emailService.SendPasswordResetEmailAsync(user.Email, resetToken, userName);

        return new ForgotPasswordResult
        {
            Message = "If an account exists with that email, a password reset link has been sent."
        };
    }

    private static string GenerateResetToken()
    {
        // Generate a secure random token (32 bytes = 256 bits)
        var randomBytes = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);

        // Convert to URL-safe base64 string
        return Convert.ToBase64String(randomBytes)
            .Replace("+", "-")
            .Replace("/", "_")
            .Replace("=", "");
    }

    private static string HashToken(string token)
    {
        // Hash the token before storing in database
        var bytes = System.Text.Encoding.UTF8.GetBytes(token);
        var hash = SHA256.HashData(bytes);
        return Convert.ToBase64String(hash);
    }
}

