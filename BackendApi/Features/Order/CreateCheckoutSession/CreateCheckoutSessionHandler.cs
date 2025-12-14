using BackendApi.Data;
using BackendApi.Entities;
using BackendApi.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Stripe;
using Stripe.Checkout;

namespace BackendApi.Features.Order.CreateCheckoutSession;

public class CreateCheckoutSessionHandler(
    ApplicationDbContext context,
    IConfiguration configuration,
    ILogger<CreateCheckoutSessionHandler> logger) : ICommandHandler<CreateCheckoutSessionCommand, CreateCheckoutSessionResult>
{
    public async Task<CreateCheckoutSessionResult> Handle(CreateCheckoutSessionCommand request, CancellationToken cancellationToken)
    {
        // Load order
        var order = await context.Orders
            .Include(o => o.Restaurant)
            .FirstOrDefaultAsync(o => o.Id == request.OrderId, cancellationToken);

        if (order == null)
        {
            throw new ArgumentException("Order not found");
        }

        var restaurant = order.Restaurant;
        if (restaurant == null)
        {
            throw new ArgumentException("Restaurant not found");
        }

        if (string.IsNullOrEmpty(restaurant.StripeConnectAccountId) || !restaurant.StripeConnectChargesEnabled)
        {
            throw new InvalidOperationException("Restaurant is not enabled for Stripe payments");
        }

        // Calculate platform fee
        var feePercentageStr = configuration["Stripe:Connect:PlatformFeePercentage"] ?? "0.03";
        var feePercentage = decimal.Parse(feePercentageStr);
        var platformFeeAmount = order.TotalAmount * feePercentage;

        var totalAmountCents = (long)(order.TotalAmount * 100);
        var platformFeeCents = (long)(platformFeeAmount * 100);

        var currency = "usd"; // TODO: use restaurant currency

        // Set API key
        var stripeKey = configuration["Stripe:Connect:SecretKey"] ?? configuration["Stripe:SecretKey"];
        StripeConfiguration.ApiKey = stripeKey;

        // Build URLs
        var frontendBase = configuration["Frontend:BaseUrl"] ?? "http://localhost:3000";
        var successUrl = $"{frontendBase}/order/{order.Id}/status?payment=success";
        var cancelUrl = $"{frontendBase}/site/{order.RestaurantId}/checkout?payment=cancelled";

        var sessionService = new SessionService();
        var sessionOptions = new SessionCreateOptions
        {
            Mode = "payment",
            SuccessUrl = successUrl,
            CancelUrl = cancelUrl,
            LineItems = new List<SessionLineItemOptions>
            {
                new SessionLineItemOptions
                {
                    Quantity = 1,
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        Currency = currency,
                        UnitAmount = totalAmountCents,
                        ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = $"Order {order.Id}"
                        }
                    }
                }
            },
            PaymentIntentData = new SessionPaymentIntentDataOptions
            {
                ApplicationFeeAmount = platformFeeCents,
                TransferData = new SessionPaymentIntentDataTransferDataOptions
                {
                    Destination = restaurant.StripeConnectAccountId
                },
                Metadata = new Dictionary<string, string>
                {
                    { "order_id", order.Id.ToString() },
                    { "restaurant_id", restaurant.Id.ToString() },
                    { "platform_fee_amount", platformFeeAmount.ToString("F2") }
                }
            },
            Metadata = new Dictionary<string, string>
            {
                { "order_id", order.Id.ToString() },
                { "restaurant_id", restaurant.Id.ToString() }
            }
        };

        var session = await sessionService.CreateAsync(sessionOptions, cancellationToken: cancellationToken);

        logger.LogInformation("Created checkout session {SessionId} for order {OrderId}", session.Id, order.Id);

        return new CreateCheckoutSessionResult(session.Url);
    }
}

