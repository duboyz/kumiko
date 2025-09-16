using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.WebsiteSection.CreateRestaurantMenuSection;

[Route("api/section/restaurant-menu")]
[Tags("WebsiteSection")]
[Authorize]
public class CreateRestaurantMenuSectionController(IMediator mediator) : BaseController(mediator)
{
    [HttpPost]
    public async Task<ActionResult<ApiResponse<CreateRestaurantMenuSectionResult>>> CreateRestaurantMenuSection([FromBody] CreateRestaurantMenuSectionCommand command)
    {
        var result = await Mediator.Send(command);
        return CreateResponse(result, ApiResponseStatusCode.Success, "Restaurant menu section created successfully");
    }
}