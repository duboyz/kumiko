using BackendApi.Shared.Contracts;
using BackendApi.Entities;

namespace BackendApi.Features.WebsiteSection.UpdateTextSection;

public record UpdateTextSectionCommand(
    Guid TextSectionId,
    string? Title,
    string? Text,
    TextAlignment AlignText,
    string? TextColor
) : ICommand<UpdateTextSectionResult>;

public record UpdateTextSectionResult(
    Guid TextSectionId
);