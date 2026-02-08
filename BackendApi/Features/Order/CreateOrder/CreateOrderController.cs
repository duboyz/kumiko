using BackendApi.Controllers;
using BackendApi.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace BackendApi.Features.Order.CreateOrder;

[Route("api/orders")]
[Tags("Order")]
public class CreateOrderController : BaseAuthenticatedController
{
    private readonly IMediator _mediator;

    public CreateOrderController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    [AllowAnonymous]
    [EnableRateLimiting("CreateOrder")]
    public async Task<ActionResult<ApiResponse<CreateOrderResult>>> CreateOrder([FromBody] CreateOrderRequest request)
    {
        // Parse pickup time from string to TimeSpan
        if (!TimeSpan.TryParse(request.PickupTime, out var pickupTime))
        {
            return BadRequest(new ApiResponse<CreateOrderResult>
            {
                Success = false,
                Message = "Invalid pickup time format. Use HH:mm:ss format.",
                Data = default
            });
        }

        // Check if customer is authenticated (optional)
        var customerId = TryGetUserId();

        var command = new CreateOrderCommand(
            customerId,
            request.CustomerName,
            request.CustomerPhone,
            request.CustomerEmail,
            request.PickupDate,
            pickupTime,
            request.AdditionalNote,
            request.RestaurantId,
            request.RestaurantMenuId,
            request.OrderItems,
            request.PaymentMethodId
        );

        var result = await _mediator.Send(command);

        return Ok(new ApiResponse<CreateOrderResult>
        {
            Success = true,
            StatusCode = ApiResponseStatusCode.Success,
            Message = "Order created successfully",
            Data = result
        });
    }
}

public record CreateOrderRequest(
    string CustomerName,
    string CustomerPhone,
    string CustomerEmail,
    DateTime PickupDate,
    string PickupTime,
    string AdditionalNote,
    Guid RestaurantId,
    Guid RestaurantMenuId,
    List<CreateOrderItemDto> OrderItems,
    string? PaymentMethodId = null
);

