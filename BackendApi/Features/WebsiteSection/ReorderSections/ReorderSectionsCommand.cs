using BackendApi.Shared.Contracts;

namespace BackendApi.Features.WebsiteSection.ReorderSections;

public record ReorderSectionsCommand(
    Guid WebsiteId,
    List<SectionOrder> SectionOrders
) : ICommand<ReorderSectionsResult>;

public record SectionOrder(
    Guid SectionId,
    int SortOrder
);

public record ReorderSectionsResult(
    bool Success
);
