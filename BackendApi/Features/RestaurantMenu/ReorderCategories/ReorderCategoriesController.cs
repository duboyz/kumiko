using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.RestaurantMenu.ReorderCategories;

[Route("api/menu-categories")]
[Tags("MenuCategory")]
[Authorize]
public class ReorderCategoriesController(IMediator mediator) : BaseController(mediator)
{
    [HttpPost("reorder")]
    public async Task<ActionResult<ApiResponse<ReorderCategoriesResult>>> ReorderCategories([FromBody] ReorderCategoriesCommand command)
    {
        var result = await Mediator.Send(command);
        return CreateResponse(result, ApiResponseStatusCode.Success, "Categories reordered successfully");
    }
}
