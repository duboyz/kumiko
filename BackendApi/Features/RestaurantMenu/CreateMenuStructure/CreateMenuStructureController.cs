using BackendApi.Shared.Controllers;
using BackendApi.Shared.Results;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.RestaurantMenu.CreateMenuStructure;

[ApiController]
[Route("api/restaurant-menu")]
public class CreateMenuStructureController(IMediator mediator) : BaseAuthenticatedController
{
    [HttpPost("create-structure")]
    public async Task<IActionResult> CreateMenuStructure([FromBody] CreateMenuStructureCommand command)
    {
        try
        {
            var result = await mediator.Send(command);
            return Ok(ApiResponse<CreateMenuStructureResult>.Success(result));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponse<CreateMenuStructureResult>.Error(ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<CreateMenuStructureResult>.Error("An error occurred while creating the menu structure"));
        }
    }
}
