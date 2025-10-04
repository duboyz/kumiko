using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.Order.CreateOrder;

[Route("api/orders")]
[Tags("Order")]
public class CreateOrderController(IMediator mediator) : BaseController(mediator)
{
    [HttpPost]
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

        var command = new CreateOrderCommand(
            request.CustomerName,
            request.CustomerPhone,
            request.CustomerEmail,
            request.PickupDate,
            pickupTime,
            request.AdditionalNote,
            request.RestaurantId,
            request.RestaurantMenuId,
            request.OrderItems
        );

        var result = await Mediator.Send(command);
        return CreateResponse(result, ApiResponseStatusCode.Success, "Order created successfully");
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
    List<CreateOrderItemDto> OrderItems
);

