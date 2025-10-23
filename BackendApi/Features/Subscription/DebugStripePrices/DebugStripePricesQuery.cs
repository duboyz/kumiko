using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Subscription.DebugStripePrices;

public record DebugStripePricesQuery() : IQuery<DebugStripePricesResult>;

public record DebugStripePricesResult(
    List<StripePriceInfo> Prices
);

public record StripePriceInfo(
    string Id,
    string ProductId,
    string ProductName,
    decimal Amount,
    string Currency,
    string Interval,
    bool Active
);
