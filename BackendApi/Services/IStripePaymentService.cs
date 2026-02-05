namespace BackendApi.Services;

public interface IStripePaymentService
{
    Task<ProcessPaymentResult> ProcessOrderPaymentAsync(
        Guid orderId,
        Guid restaurantId,
        string restaurantStripeAccountId,
        decimal totalAmount,
        string currency,
        string customerEmail,
        string? paymentMethodId = null,
        CancellationToken cancellationToken = default);

    Task<RefundPaymentResult> RefundOrderPaymentAsync(
        string paymentIntentId,
        string restaurantStripeAccountId,
        decimal? amount = null,
        CancellationToken cancellationToken = default);
}

public record ProcessPaymentResult(
    bool Success,
    string? PaymentIntentId,
    string? ClientSecret,
    decimal PlatformFeeAmount,
    string? ErrorMessage
);

public record RefundPaymentResult(
    bool Success,
    string? RefundId,
    string? ErrorMessage
);

