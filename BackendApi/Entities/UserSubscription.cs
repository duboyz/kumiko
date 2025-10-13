namespace BackendApi.Entities;

public enum SubscriptionStatus
{
    Trialing = 0,
    Active = 1,
    Canceled = 2,
    PastDue = 3,
    Expired = 4
}

public enum BillingInterval
{
    Monthly = 0,
    Yearly = 1
}

public class UserSubscription : BaseEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public Guid SubscriptionPlanId { get; set; }
    public SubscriptionPlan SubscriptionPlan { get; set; } = null!;

    public SubscriptionStatus Status { get; set; } = SubscriptionStatus.Trialing;
    public BillingInterval BillingInterval { get; set; } = BillingInterval.Monthly;

    // Trial information
    public DateTime? TrialStartDate { get; set; }
    public DateTime? TrialEndDate { get; set; }

    // Subscription dates
    public DateTime? SubscriptionStartDate { get; set; }
    public DateTime? SubscriptionEndDate { get; set; }
    public DateTime? CanceledAt { get; set; }

    // Stripe-related fields
    public string? StripeCustomerId { get; set; }
    public string? StripeSubscriptionId { get; set; }
    public DateTime? CurrentPeriodStart { get; set; }
    public DateTime? CurrentPeriodEnd { get; set; }
}
