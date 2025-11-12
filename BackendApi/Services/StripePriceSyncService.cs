using BackendApi.Data;
using BackendApi.Entities;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Services;

/// <summary>
/// Hosted service that synchronizes Stripe price IDs from configuration to database on startup
/// </summary>
public class StripePriceSyncService : IHostedService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly IConfiguration _configuration;
    private readonly ILogger<StripePriceSyncService> _logger;

    public StripePriceSyncService(
        IServiceProvider serviceProvider,
        IConfiguration configuration,
        ILogger<StripePriceSyncService> logger)
    {
        _serviceProvider = serviceProvider;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Starting Stripe price synchronization service");

        try
        {
            using var scope = _serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            // Get Stripe price configuration
            var basicMonthly = _configuration["Stripe:Prices:Basic:Monthly"];
            var basicYearly = _configuration["Stripe:Prices:Basic:Yearly"];
            var premiumMonthly = _configuration["Stripe:Prices:Premium:Monthly"];
            var premiumYearly = _configuration["Stripe:Prices:Premium:Yearly"];
            var enterpriseMonthly = _configuration["Stripe:Prices:Enterprise:Monthly"];
            var enterpriseYearly = _configuration["Stripe:Prices:Enterprise:Yearly"];

            // Check if any prices are configured
            if (string.IsNullOrEmpty(basicMonthly) &&
                string.IsNullOrEmpty(premiumMonthly) &&
                string.IsNullOrEmpty(enterpriseMonthly))
            {
                _logger.LogWarning("No Stripe price IDs configured in appsettings.json. " +
                    "Please add your Stripe price IDs to Stripe:Prices section.");
                return;
            }

            // Update Basic plan
            await UpdatePlanPrices(context, SubscriptionTier.Basic, basicMonthly, basicYearly, cancellationToken);

            // Update Premium plan
            await UpdatePlanPrices(context, SubscriptionTier.Premium, premiumMonthly, premiumYearly, cancellationToken);

            // Update Enterprise plan
            await UpdatePlanPrices(context, SubscriptionTier.Enterprise, enterpriseMonthly, enterpriseYearly, cancellationToken);

            await context.SaveChangesAsync(cancellationToken);
            _logger.LogInformation("Stripe price synchronization completed successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while synchronizing Stripe prices");
            // Don't throw - allow the application to start even if price sync fails
        }
    }

    private async Task UpdatePlanPrices(
        ApplicationDbContext context,
        SubscriptionTier tier,
        string? monthlyPriceId,
        string? yearlyPriceId,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(monthlyPriceId) && string.IsNullOrEmpty(yearlyPriceId))
        {
            _logger.LogDebug("No price IDs configured for {Tier} plan", tier);
            return;
        }

        var plan = await context.SubscriptionPlans
            .FirstOrDefaultAsync(p => p.Tier == tier, cancellationToken);

        if (plan == null)
        {
            _logger.LogWarning("Subscription plan for tier {Tier} not found in database", tier);
            return;
        }

        var updated = false;

        // Only update if the price ID is different and not empty
        if (!string.IsNullOrEmpty(monthlyPriceId) && plan.StripePriceIdMonthly != monthlyPriceId)
        {
            _logger.LogInformation("Updating {Tier} monthly price ID from {Old} to {New}",
                tier, plan.StripePriceIdMonthly ?? "null", monthlyPriceId);
            plan.StripePriceIdMonthly = monthlyPriceId;
            updated = true;
        }

        if (!string.IsNullOrEmpty(yearlyPriceId) && plan.StripePriceIdYearly != yearlyPriceId)
        {
            _logger.LogInformation("Updating {Tier} yearly price ID from {Old} to {New}",
                tier, plan.StripePriceIdYearly ?? "null", yearlyPriceId);
            plan.StripePriceIdYearly = yearlyPriceId;
            updated = true;
        }

        if (updated)
        {
            plan.UpdatedAt = DateTime.UtcNow;
            _logger.LogInformation("Updated Stripe price IDs for {Tier} plan", tier);
        }
        else
        {
            _logger.LogDebug("No updates needed for {Tier} plan", tier);
        }
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Stripe price synchronization service stopped");
        return Task.CompletedTask;
    }
}