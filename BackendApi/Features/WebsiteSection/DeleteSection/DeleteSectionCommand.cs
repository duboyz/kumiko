using BackendApi.Shared.Contracts;

namespace BackendApi.Features.WebsiteSection.DeleteSection;

public record DeleteSectionCommand(
    Guid SectionId
) : ICommand<DeleteSectionResult>;

public record DeleteSectionResult(
    bool Success
);