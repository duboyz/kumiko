using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.RestaurantMenu.BulkDeleteMenuItems;

[Route("api/menu-items")]
[Tags("MenuItem")]
[Authorize]
public class BulkDeleteMenuItemsController(IMediator mediator) : BaseController(mediator)
{
    [HttpDelete("bulk")]
    public async Task<ActionResult<ApiResponse<BulkDeleteMenuItemsResult>>> BulkDeleteMenuItems([FromBody] BulkDeleteMenuItemsCommand command)
    {
        var result = await Mediator.Send(command);
        return CreateResponse(result, ApiResponseStatusCode.Success, $"Successfully deleted {result.ItemsDeleted} menu items. {result.ItemsNotFound} items were not found.");
    }
}
