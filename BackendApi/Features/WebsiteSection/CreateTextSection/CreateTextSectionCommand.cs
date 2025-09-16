using BackendApi.Shared.Contracts;
using BackendApi.Entities;

namespace BackendApi.Features.WebsiteSection.CreateTextSection;

public record CreateTextSectionCommand(
    Guid WebsitePageId,
    int SortOrder,
    string? Title,
    string? Text,
    TextAlignment AlignText,
    string? TextColor
) : ICommand<CreateTextSectionResult>;

public record CreateTextSectionResult(
    Guid SectionId,
    Guid TextSectionId
);