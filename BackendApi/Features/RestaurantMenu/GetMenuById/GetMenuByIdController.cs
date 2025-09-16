using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.RestaurantMenu.GetMenuById;

[Route("api/menu")]
[Tags("Menu")]
public class GetMenuByIdController(IMediator mediator) : BaseController(mediator)
{
    [HttpGet("{menuId}")]
    public async Task<ActionResult<ApiResponse<GetMenuByIdResult>>> GetMenuById(Guid menuId)
    {
        var query = new GetMenuByIdQuery(menuId);
        var result = await Mediator.Send(query);
        return CreateResponse(result);
    }
}