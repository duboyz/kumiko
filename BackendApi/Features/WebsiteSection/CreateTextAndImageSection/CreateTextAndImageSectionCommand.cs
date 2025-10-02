using BackendApi.Shared.Contracts;
using BackendApi.Entities;

namespace BackendApi.Features.WebsiteSection.CreateTextAndImageSection;

public record CreateTextAndImageSectionCommand(
    Guid WebsitePageId,
    int SortOrder,
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
) : ICommand<CreateTextAndImageSectionResult>;

public record CreateTextAndImageSectionResult(
    Guid SectionId,
    Guid TextAndImageSectionId
);
