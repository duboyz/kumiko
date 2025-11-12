using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Subscription.GetUsageStats;

public record GetUsageStatsQuery() : IQuery<GetUsageStatsResult>;

public record GetUsageStatsResult(
    int CurrentLocations,
    int MaxLocations,
    int CurrentMenusPerLocation,
    int MaxMenusPerLocation,
    bool IsUnlimitedLocations,
    bool IsUnlimitedMenus
);