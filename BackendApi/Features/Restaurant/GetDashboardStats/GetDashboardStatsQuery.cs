using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Restaurant.GetDashboardStats;

public record GetDashboardStatsQuery(
    Guid RestaurantId,
    int Days = 30
) : IQuery<DashboardStatsResult>;

public record DashboardStatsResult
{
    public required List<TopMenuItem> TopMenuItems { get; init; }
    public required List<DailyOrderStats> DailyOrders { get; init; }
    public required List<DailyRevenueStats> DailyRevenue { get; init; }
    public required List<WeeklyOrderStats> WeeklyOrders { get; init; }
    public required List<WeeklyRevenueStats> WeeklyRevenue { get; init; }
    public required List<MonthlyOrderStats> MonthlyOrders { get; init; }
    public required List<MonthlyRevenueStats> MonthlyRevenue { get; init; }
    public required OverallStats Overall { get; init; }
}

public record TopMenuItem
{
    public required Guid MenuItemId { get; init; }
    public required string MenuItemName { get; init; }
    public required int TotalQuantitySold { get; init; }
    public required decimal TotalRevenue { get; init; }
}

public record DailyOrderStats
{
    public required DateTime Date { get; init; }
    public required int OrderCount { get; init; }
    public required int ItemCount { get; init; }
}

public record DailyRevenueStats
{
    public required DateTime Date { get; init; }
    public required decimal Revenue { get; init; }
}

public record WeeklyOrderStats
{
    public required DateTime WeekStartDate { get; init; }
    public required int WeekNumber { get; init; }
    public required int Year { get; init; }
    public required int OrderCount { get; init; }
    public required int ItemCount { get; init; }
}

public record WeeklyRevenueStats
{
    public required DateTime WeekStartDate { get; init; }
    public required int WeekNumber { get; init; }
    public required int Year { get; init; }
    public required decimal Revenue { get; init; }
}

public record MonthlyOrderStats
{
    public required DateTime MonthStartDate { get; init; }
    public required int Month { get; init; }
    public required int Year { get; init; }
    public required int OrderCount { get; init; }
    public required int ItemCount { get; init; }
}

public record MonthlyRevenueStats
{
    public required DateTime MonthStartDate { get; init; }
    public required int Month { get; init; }
    public required int Year { get; init; }
    public required decimal Revenue { get; init; }
}

public record OverallStats
{
    public required int TotalOrders { get; init; }
    public required int TotalItemsSold { get; init; }
    public required decimal TotalRevenue { get; init; }
    public required decimal AverageOrderValue { get; init; }
}

