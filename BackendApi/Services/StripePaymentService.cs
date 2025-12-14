using Stripe;

namespace BackendApi.Services;

public class StripePaymentService(
    IConfiguration configuration,
    ILogger<StripePaymentService> logger) : IStripePaymentService
{
    public async Task<ProcessPaymentResult> ProcessOrderPaymentAsync(
        Guid orderId,
        Guid restaurantId,
        string restaurantStripeAccountId,
        decimal totalAmount,
        string customerEmail,
        string? paymentMethodId = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            // Set Stripe API key
            var stripeKey = configuration["Stripe:Connect:SecretKey"] ?? configuration["Stripe:SecretKey"];
            StripeConfiguration.ApiKey = stripeKey;

            // Get platform fee percentage
            var feePercentageStr = configuration["Stripe:Connect:PlatformFeePercentage"] ?? "0.03";
            var feePercentage = decimal.Parse(feePercentageStr);
            var platformFeeAmount = totalAmount * feePercentage;

            logger.LogInformation(
                "Processing payment for order {OrderId}: Total={TotalAmount}, PlatformFee={PlatformFee}, RestaurantAccount={AccountId}",
                orderId, totalAmount, platformFeeAmount, restaurantStripeAccountId);

            // Convert amounts to cents (Stripe uses smallest currency unit)
            var totalAmountCents = (long)(totalAmount * 100);
            var platformFeeCents = (long)(platformFeeAmount * 100);
            var restaurantAmountCents = totalAmountCents - platformFeeCents; // Amount restaurant receives

            // For Standard accounts, we use direct charges with application fee
            var paymentIntentService = new PaymentIntentService();
            var paymentIntentOptions = new PaymentIntentCreateOptions
            {
                Amount = totalAmountCents,
                Currency = "usd", // TODO: Get from restaurant currency setting
                ApplicationFeeAmount = platformFeeCents, // Stripe routes fee to platform balance automatically
                AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
                {
                    Enabled = true
                },
                Metadata = new Dictionary<string, string>
                {
                    { "order_id", orderId.ToString() },
                    { "restaurant_id", restaurantId.ToString() },
                    { "platform_fee_amount", platformFeeAmount.ToString("F2") },
                    { "restaurant_amount", (restaurantAmountCents / 100m).ToString("F2") }
                },
                ReceiptEmail = customerEmail
            };

            // Create PaymentIntent ON the connected account (direct charge)
            // This requires using the Stripe-Account header
            var requestOptions = new RequestOptions
            {
                StripeAccount = restaurantStripeAccountId
            };

            var paymentIntent = await paymentIntentService.CreateAsync(
                paymentIntentOptions, 
                requestOptions, 
                cancellationToken: cancellationToken);

            logger.LogInformation(
                "Created payment intent {PaymentIntentId} on connected account {AccountId} for order {OrderId}. " +
                "Total: {Total}, Platform Fee: {Fee}, Restaurant Receives: {RestaurantAmount}",
                paymentIntent.Id, restaurantStripeAccountId, orderId, 
                totalAmount, platformFeeAmount, restaurantAmountCents / 100m);

            // IMPORTANT: For Standard accounts, we need to transfer the platform fee AFTER payment succeeds
            // This is done via webhook when payment_intent.succeeded event is received
            // The webhook handler should create a Transfer from the connected account to the platform

            logger.LogInformation(
                "Created payment intent {PaymentIntentId} for order {OrderId}. Status: {Status}, ClientSecret: {ClientSecret}",
                paymentIntent.Id, orderId, paymentIntent.Status, paymentIntent.ClientSecret);

            return new ProcessPaymentResult(
                Success: true,
                PaymentIntentId: paymentIntent.Id,
                ClientSecret: paymentIntent.ClientSecret,
                PlatformFeeAmount: platformFeeAmount,
                ErrorMessage: null
            );
        }
        catch (StripeException ex)
        {
            logger.LogError(ex, "Stripe error processing payment for order {OrderId}", orderId);
            return new ProcessPaymentResult(
                Success: false,
                PaymentIntentId: null,
                ClientSecret: null,
                PlatformFeeAmount: 0,
                ErrorMessage: ex.Message
            );
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error processing payment for order {OrderId}", orderId);
            return new ProcessPaymentResult(
                Success: false,
                PaymentIntentId: null,
                ClientSecret: null,
                PlatformFeeAmount: 0,
                ErrorMessage: ex.Message
            );
        }
    }

    public async Task<RefundPaymentResult> RefundOrderPaymentAsync(
        string paymentIntentId,
        string restaurantStripeAccountId,
        decimal? amount = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            // Set Stripe API key
            var stripeKey = configuration["Stripe:Connect:SecretKey"] ?? configuration["Stripe:SecretKey"];
            StripeConfiguration.ApiKey = stripeKey;

            logger.LogInformation("Processing refund for payment intent {PaymentIntentId}", paymentIntentId);

            var refundService = new RefundService();
            var refundOptions = new RefundCreateOptions
            {
                PaymentIntent = paymentIntentId,
                ReverseTransfer = true, // Reverse the transfer to connected account
                RefundApplicationFee = true // Refund the platform fee
            };

            if (amount.HasValue)
            {
                refundOptions.Amount = (long)(amount.Value * 100);
            }

            var refund = await refundService.CreateAsync(refundOptions, cancellationToken: cancellationToken);

            logger.LogInformation("Created refund {RefundId} for payment intent {PaymentIntentId}", refund.Id, paymentIntentId);

            return new RefundPaymentResult(
                Success: true,
                RefundId: refund.Id,
                ErrorMessage: null
            );
        }
        catch (StripeException ex)
        {
            logger.LogError(ex, "Stripe error refunding payment {PaymentIntentId}", paymentIntentId);
            return new RefundPaymentResult(
                Success: false,
                RefundId: null,
                ErrorMessage: ex.Message
            );
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error refunding payment {PaymentIntentId}", paymentIntentId);
            return new RefundPaymentResult(
                Success: false,
                RefundId: null,
                ErrorMessage: ex.Message
            );
        }
    }
}

