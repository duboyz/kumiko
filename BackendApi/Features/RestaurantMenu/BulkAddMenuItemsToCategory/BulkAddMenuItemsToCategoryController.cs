using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.RestaurantMenu.BulkAddMenuItemsToCategory;

[Route("api/menu-category-items")]
[Tags("MenuCategoryItem")]
[Authorize]
public class BulkAddMenuItemsToCategoryController(IMediator mediator) : BaseController(mediator)
{
    [HttpPost("bulk")]
    public async Task<ActionResult<ApiResponse<BulkAddMenuItemsToCategoryResult>>> BulkAddMenuItemsToCategory([FromBody] BulkAddMenuItemsToCategoryCommand command)
    {
        var result = await Mediator.Send(command);
        return CreateResponse(result, ApiResponseStatusCode.Created, $"Successfully added {result.ItemsAdded} menu items to category. {result.ItemsSkipped} items were skipped.");
    }
}
