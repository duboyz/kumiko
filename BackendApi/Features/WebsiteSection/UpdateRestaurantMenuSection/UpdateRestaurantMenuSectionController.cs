using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.WebsiteSection.UpdateRestaurantMenuSection;

[Route("api/section/restaurant-menu")]
[Tags("WebsiteSection")]
[Authorize]
public class UpdateRestaurantMenuSectionController(IMediator mediator) : BaseController(mediator)
{
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<UpdateRestaurantMenuSectionResult>>> UpdateRestaurantMenuSection(Guid id, [FromBody] UpdateRestaurantMenuSectionCommand command)
    {
        var commandWithId = command with { RestaurantMenuSectionId = id };
        var result = await Mediator.Send(commandWithId);
        return CreateResponse(result, ApiResponseStatusCode.Success, "Restaurant menu section updated successfully");
    }
}