using BackendApi.Models;
using BackendApi.Models.Restaurant;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.Restaurant.CreateRestaurant;

[Route("api/restaurants")]
[Tags("Restaurant")]
[Authorize]
public class CreateRestaurantController(IMediator mediator, ILogger<CreateRestaurantController> logger) : BaseController(mediator)
{
    [HttpPost]
    public async Task<ActionResult<ApiResponse<RestaurantBaseDto>>> CreateRestaurant([FromBody] CreateRestaurantCommand command)
    {
        logger.LogInformation("=== CreateRestaurant called ===");
        logger.LogInformation("Name: {Name}", command.Name);
        logger.LogInformation("BusinessHours length: {Length}", command.BusinessHours?.Length ?? 0);
        logger.LogInformation("BusinessHours content: {BusinessHours}", command.BusinessHours ?? "NULL");
        
        var result = await Mediator.Send(command);
        return CreateResponse(result, ApiResponseStatusCode.Success, "Restaurant created successfully");
    }
}