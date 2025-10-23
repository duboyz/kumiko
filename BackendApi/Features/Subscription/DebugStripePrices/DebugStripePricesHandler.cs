using BackendApi.Shared.Contracts;
using Microsoft.Extensions.Configuration;
using Stripe;

namespace BackendApi.Features.Subscription.DebugStripePrices;

public class DebugStripePricesHandler(
    IConfiguration configuration,
    ILogger<DebugStripePricesHandler> logger)
    : IQueryHandler<DebugStripePricesQuery, DebugStripePricesResult>
{
    public async Task<DebugStripePricesResult> Handle(DebugStripePricesQuery request, CancellationToken cancellationToken)
    {
        // Set Stripe API key
        StripeConfiguration.ApiKey = configuration["Stripe:SecretKey"];

        Console.WriteLine(configuration["Stripe:SecretKey"]);

        logger.LogInformation("Fetching all prices from Stripe...");

        var priceService = new PriceService();
        var options = new PriceListOptions
        {
            Limit = 100,
            Expand = new List<string> { "data.product" }
        };

        var prices = await priceService.ListAsync(options, cancellationToken: cancellationToken);

        var priceInfos = new List<StripePriceInfo>();

        foreach (var price in prices.Data)
        {
            var productName = price.Product is Product product ? product.Name : "Unknown";
            var productId = price.Product is Product prod ? prod.Id : price.ProductId;

            var priceInfo = new StripePriceInfo(
                Id: price.Id,
                ProductId: productId,
                ProductName: productName,
                Amount: (decimal)price.UnitAmount! / 100, // Convert from cents to dollars
                Currency: price.Currency.ToUpper(),
                Interval: price.Recurring?.Interval ?? "one_time",
                Active: price.Active
            );

            priceInfos.Add(priceInfo);

            Console.WriteLine(priceInfo);
            Console.WriteLine(price.Id);
            Console.WriteLine(productName);
            Console.WriteLine(productId);
            Console.WriteLine(priceInfo.Currency);
            Console.WriteLine(priceInfo.Amount);
            Console.WriteLine(priceInfo.Interval);
            Console.WriteLine(price.Active);

            logger.LogInformation(
                "Price: {PriceId} | Product: {ProductName} ({ProductId}) | Amount: {Currency} {Amount} | Interval: {Interval} | Active: {Active}",
                price.Id,
                productName,
                productId,
                priceInfo.Currency,
                priceInfo.Amount,
                priceInfo.Interval,
                price.Active
            );
        }

        logger.LogInformation("Total prices found: {Count}", priceInfos.Count);

        return new DebugStripePricesResult(priceInfos);
    }
}
