using BackendApi.Entities;
using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.WebsiteSection.UpdateTextSection;

[Route("api/section/text")]
[Tags("WebsiteSection")]
[Authorize]
public class UpdateTextSectionController(IMediator mediator) : BaseController(mediator)
{
    [HttpPut("{textSectionId}")]
    public async Task<ActionResult<ApiResponse<UpdateTextSectionResult>>> UpdateTextSection(
        Guid textSectionId,
        [FromBody] UpdateTextSectionRequest request)
    {
        var command = new UpdateTextSectionCommand(
            textSectionId,
            request.Title,
            request.Text,
            Enum.Parse<TextAlignment>(request.AlignText),
            request.TextColor
        );

        var result = await Mediator.Send(command);
        return CreateResponse(result, ApiResponseStatusCode.Success, "Text section updated successfully");
    }
}

public record UpdateTextSectionRequest
{
    public string? Title { get; init; }
    public string? Text { get; init; }
    public string AlignText { get; init; } = "Left";
    public string? TextColor { get; init; }
}