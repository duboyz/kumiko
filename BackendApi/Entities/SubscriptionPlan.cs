namespace BackendApi.Entities;

public enum SubscriptionTier
{
    Basic = 0,
    Premium = 1,
    Enterprise = 2
}

public class SubscriptionPlan : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public SubscriptionTier Tier { get; set; }
    public decimal MonthlyPrice { get; set; }
    public decimal YearlyPrice { get; set; }
    public int MaxLocations { get; set; }
    public int MaxMenusPerLocation { get; set; }
    public string? StripePriceIdMonthly { get; set; }
    public string? StripePriceIdYearly { get; set; }
    public bool IsActive { get; set; } = true;

    public ICollection<UserSubscription> UserSubscriptions { get; set; } = [];
}
