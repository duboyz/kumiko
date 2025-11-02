using System.Security.Cryptography;
using BackendApi.Data;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.Auth.ResetPassword;

public class ResetPasswordHandler(ApplicationDbContext context) : ICommandHandler<ResetPasswordCommand, ResetPasswordResult>
{
    public async Task<ResetPasswordResult> Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
    {
        // Hash the provided token
        var hashedToken = HashToken(request.Token);

        // Find user with matching token
        var user = await context.Users
            .FirstOrDefaultAsync(u => u.PasswordResetToken == hashedToken, cancellationToken);

        if (user == null)
        {
            throw new InvalidOperationException("Invalid or expired reset token");
        }

        // Check if token has expired
        if (user.PasswordResetTokenExpiresAt == null || user.PasswordResetTokenExpiresAt < DateTime.UtcNow)
        {
            throw new InvalidOperationException("Reset token has expired");
        }

        // Hash the new password
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);

        // Update user password and clear reset token
        user.PasswordHash = passwordHash;
        user.PasswordResetToken = null;
        user.PasswordResetTokenExpiresAt = null;

        await context.SaveChangesAsync(cancellationToken);

        return new ResetPasswordResult
        {
            Message = "Password has been reset successfully"
        };
    }

    private static string HashToken(string token)
    {
        // Hash the token the same way it was hashed when stored
        var bytes = System.Text.Encoding.UTF8.GetBytes(token);
        var hash = SHA256.HashData(bytes);
        return Convert.ToBase64String(hash);
    }
}

