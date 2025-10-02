using BackendApi.Entities;
using BackendApi.Models;
using BackendApi.Shared.Controllers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Features.WebsiteSection.UpdateTextAndImageSection;

[Route("api/section/text-and-image")]
[Tags("WebsiteSection")]
[Authorize]
public class UpdateTextAndImageSectionController(IMediator mediator) : BaseController(mediator)
{
    [HttpPut("{textAndImageSectionId}")]
    public async Task<ActionResult<ApiResponse<UpdateTextAndImageSectionResult>>> UpdateTextAndImageSection(
        Guid textAndImageSectionId,
        [FromBody] UpdateTextAndImageSectionRequest request)
    {
        var command = new UpdateTextAndImageSectionCommand(
            textAndImageSectionId,
            request.Title,
            request.Content,
            request.ButtonText,
            request.ButtonUrl,
            request.ImageUrl,
            request.ImageAlt,
            request.TextColor,
            request.ButtonColor,
            request.ButtonTextColor,
            Enum.Parse<TextAlignment>(request.Alignment),
            request.ImageOnLeft
        );

        var result = await Mediator.Send(command);
        return CreateResponse(result, ApiResponseStatusCode.Success, "Text and image section updated successfully");
    }
}

public record UpdateTextAndImageSectionRequest
{
    public string? Title { get; init; }
    public string? Content { get; init; }
    public string? ButtonText { get; init; }
    public string? ButtonUrl { get; init; }
    public string? ImageUrl { get; init; }
    public string? ImageAlt { get; init; }
    public string? TextColor { get; init; }
    public string? ButtonColor { get; init; }
    public string? ButtonTextColor { get; init; }
    public string Alignment { get; init; } = "Left";
    public bool ImageOnLeft { get; init; } = false;
}
