using BackendApi.Shared.Contracts;
using BackendApi.Entities;

namespace BackendApi.Features.WebsiteSection.UpdateTextAndImageSection;

public record UpdateTextAndImageSectionCommand(
    Guid TextAndImageSectionId,
    string? Title,
    string? Content,
    string? ButtonText,
    string? ButtonUrl,
    string? ImageUrl,
    string? ImageAlt,
    string? TextColor,
    string? ButtonColor,
    string? ButtonTextColor,
    TextAlignment Alignment,
    bool ImageOnLeft
) : ICommand<UpdateTextAndImageSectionResult>;

public record UpdateTextAndImageSectionResult(
    Guid TextAndImageSectionId
);
