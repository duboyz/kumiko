using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.RestaurantMenu.ReorderMenuItems;

[Route("api/menu-categories")]
[Tags("MenuCategory")]
[Authorize]
public class ReorderMenuItemsController(IMediator mediator) : BaseController(mediator)
{
    [HttpPost("{categoryId}/reorder-items")]
    public async Task<ActionResult<ApiResponse<ReorderMenuItemsResult>>> ReorderMenuItems(
        [FromRoute] Guid categoryId,
        [FromBody] ReorderMenuItemsRequest request)
    {
        var command = new ReorderMenuItemsCommand(categoryId, request.CategoryItemIds);
        var result = await Mediator.Send(command);
        return CreateResponse(result, ApiResponseStatusCode.Success, "Menu items reordered successfully");
    }
}

public record ReorderMenuItemsRequest(
    List<Guid> CategoryItemIds
);
