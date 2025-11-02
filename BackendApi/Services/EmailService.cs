using Resend;

namespace BackendApi.Services;

public class EmailService : IEmailService
{
    private readonly IResend _resend;
    private readonly IConfiguration _configuration;
    private readonly string _fromEmail;
    private readonly string _fromName;
    private readonly string _frontendUrl;

    public EmailService(IResend resend, IConfiguration configuration)
    {
        _resend = resend;
        _configuration = configuration;
        _fromEmail = _configuration["Email:FromEmail"]
            ?? throw new ArgumentNullException("Email:FromEmail", "From email is not configured");
        _fromName = _configuration["Email:FromName"] ?? "Kumiko";
        _frontendUrl = _configuration["App:FrontendUrl"]
            ?? throw new ArgumentNullException("App:FrontendUrl", "Frontend URL is not configured");
    }

    public async Task SendPasswordResetEmailAsync(string toEmail, string resetToken, string userName)
    {
        try
        {
            var resetUrl = $"{_frontendUrl}/reset-password?token={resetToken}";

            var message = new EmailMessage
            {
                From = _fromEmail,
                To = new[] { toEmail },
                Subject = "Reset Your Password",
                HtmlBody = $@"
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset='utf-8'>
                        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                        <style>
                            body {{ 
                                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
                                line-height: 1.6; 
                                color: #000000; 
                                margin: 0; 
                                padding: 0; 
                                background-color: #ffffff;
                            }}
                            .container {{ 
                                max-width: 600px; 
                                margin: 0 auto; 
                                padding: 40px 20px; 
                            }}
                            .header {{ 
                                border-bottom: 2px solid #000000; 
                                padding-bottom: 20px; 
                                margin-bottom: 30px; 
                            }}
                            .logo {{ 
                                font-size: 24px; 
                                font-weight: 700; 
                                color: #000000; 
                                letter-spacing: -0.5px;
                            }}
                            .content {{ 
                                padding: 0; 
                            }}
                            .content p {{ 
                                margin: 16px 0; 
                                color: #000000; 
                            }}
                            .button {{ 
                                display: inline-block; 
                                background: #000000; 
                                color: #ffffff; 
                                padding: 14px 32px; 
                                text-decoration: none; 
                                border-radius: 6px; 
                                margin: 24px 0; 
                                font-weight: 600;
                                border: 2px solid #000000;
                            }}
                            .button:hover {{ 
                                background: #ffffff; 
                                color: #000000; 
                            }}
                            .link-box {{ 
                                background: #f5f5f5; 
                                border: 1px solid #e0e0e0; 
                                padding: 16px; 
                                margin: 20px 0; 
                                border-radius: 6px; 
                                word-break: break-all; 
                                font-size: 14px;
                                color: #000000;
                            }}
                            .warning {{ 
                                background: #f5f5f5; 
                                border-left: 3px solid #000000; 
                                padding: 16px; 
                                margin: 24px 0;
                                border-radius: 4px;
                            }}
                            .footer {{ 
                                text-align: center; 
                                padding-top: 30px; 
                                margin-top: 40px; 
                                border-top: 1px solid #e0e0e0; 
                                color: #666666; 
                                font-size: 12px; 
                            }}
                            .footer p {{ 
                                margin: 8px 0; 
                                color: #666666;
                            }}
                        </style>
                    </head>
                    <body>
                        <div class='container'>
                            <div class='header'>
                                <div class='logo'>Kumiko</div>
                            </div>
                            <div class='content'>
                                <h2 style='margin: 0 0 24px 0; font-size: 24px; font-weight: 600; color: #000000;'>Reset Your Password</h2>
                                <p>Hello {userName},</p>
                                <p>We received a request to reset your password for your Kumiko account. Click the button below to create a new password:</p>
                                <div style='text-align: center;'>
                                    <a href='{resetUrl}' class='button'>Reset Password</a>
                                </div>
                                <p style='margin-top: 24px;'>Or copy and paste this link into your browser:</p>
                                <div class='link-box'>{resetUrl}</div>
                                <div class='warning'>
                                    <strong>Important:</strong> This link will expire in 1 hour for security reasons.
                                </div>
                                <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
                                <p style='margin-top: 32px;'>Best regards,<br><strong>The Kumiko Team</strong></p>
                            </div>
                            <div class='footer'>
                                <p>© {DateTime.UtcNow.Year} Kumiko. All rights reserved.</p>
                                <p>This is an automated email. Please do not reply.</p>
                            </div>
                        </div>
                    </body>
                    </html>
                "
            };

            await _resend.EmailSendAsync(message);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Failed to send password reset email: {ex.Message}");
            throw;
        }
    }

    public async Task SendWelcomeEmailAsync(string toEmail, string userName)
    {
        try
        {
            var message = new EmailMessage
            {
                From = _fromEmail,
                To = new[] { toEmail },
                Subject = "Welcome to Kumiko! 🎉",
                HtmlBody = $@"
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset='utf-8'>
                        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                        <style>
                            body {{ 
                                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
                                line-height: 1.6; 
                                color: #000000; 
                                margin: 0; 
                                padding: 0; 
                                background-color: #ffffff;
                            }}
                            .container {{ 
                                max-width: 600px; 
                                margin: 0 auto; 
                                padding: 40px 20px; 
                            }}
                            .header {{ 
                                border-bottom: 2px solid #000000; 
                                padding-bottom: 20px; 
                                margin-bottom: 30px; 
                            }}
                            .logo {{ 
                                font-size: 24px; 
                                font-weight: 700; 
                                color: #000000; 
                                letter-spacing: -0.5px;
                            }}
                            .content {{ 
                                padding: 0; 
                            }}
                            .content p {{ 
                                margin: 16px 0; 
                                color: #000000; 
                            }}
                            .button {{ 
                                display: inline-block; 
                                background: #000000; 
                                color: #ffffff; 
                                padding: 14px 32px; 
                                text-decoration: none; 
                                border-radius: 6px; 
                                margin: 24px 0; 
                                font-weight: 600;
                                border: 2px solid #000000;
                            }}
                            .button:hover {{ 
                                background: #ffffff; 
                                color: #000000; 
                            }}
                            .feature {{ 
                                margin: 16px 0; 
                                padding: 20px; 
                                border: 1px solid #e0e0e0; 
                                border-radius: 6px;
                                background: #ffffff;
                            }}
                            .feature-title {{ 
                                font-weight: 600; 
                                color: #000000; 
                                margin-bottom: 8px;
                                font-size: 16px;
                            }}
                            .feature-desc {{ 
                                color: #666666; 
                                font-size: 14px;
                                margin: 0;
                            }}
                            .footer {{ 
                                text-align: center; 
                                padding-top: 30px; 
                                margin-top: 40px; 
                                border-top: 1px solid #e0e0e0; 
                                color: #666666; 
                                font-size: 12px; 
                            }}
                            .footer p {{ 
                                margin: 8px 0; 
                                color: #666666;
                            }}
                        </style>
                    </head>
                    <body>
                        <div class='container'>
                            <div class='header'>
                                <div class='logo'>Kumiko</div>
                            </div>
                            <div class='content'>
                                <h2 style='margin: 0 0 24px 0; font-size: 24px; font-weight: 600; color: #000000;'>Welcome to Kumiko!</h2>
                                <p>Hello {userName},</p>
                                <p>Thank you for joining Kumiko! We're excited to help you manage your restaurant and create amazing digital experiences for your customers.</p>
                                
                                <h3 style='margin: 32px 0 16px 0; font-size: 18px; font-weight: 600; color: #000000;'>Get Started</h3>
                                
                                <div class='feature'>
                                    <div class='feature-title'>Create Your Digital Menu</div>
                                    <p class='feature-desc'>Build beautiful, interactive menus that work on any device.</p>
                                </div>
                                
                                <div class='feature'>
                                    <div class='feature-title'>Manage Orders</div>
                                    <p class='feature-desc'>Track and manage customer orders in real-time.</p>
                                </div>
                                
                                <div class='feature'>
                                    <div class='feature-title'>View Analytics</div>
                                    <p class='feature-desc'>Get insights into your sales and popular items.</p>
                                </div>
                                
                                <div style='text-align: center; margin-top: 32px;'>
                                    <a href='{_frontendUrl}/dashboard' class='button'>Go to Dashboard</a>
                                </div>
                                
                                <p style='margin-top: 32px;'>If you have any questions or need help getting started, our support team is here for you.</p>
                                <p style='margin-top: 32px;'>Best regards,<br><strong>The Kumiko Team</strong></p>
                            </div>
                            <div class='footer'>
                                <p>© {DateTime.UtcNow.Year} Kumiko. All rights reserved.</p>
                            </div>
                        </div>
                    </body>
                    </html>
                "
            };

            await _resend.EmailSendAsync(message);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Failed to send welcome email: {ex.Message}");
            // Don't throw here - welcome email is not critical
        }
    }
}

