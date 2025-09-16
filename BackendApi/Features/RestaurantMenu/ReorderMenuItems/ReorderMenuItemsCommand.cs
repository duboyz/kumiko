using BackendApi.Shared.Contracts;

namespace BackendApi.Features.RestaurantMenu.ReorderMenuItems;

public record ReorderMenuItemsCommand(
    Guid CategoryId,
    List<Guid> CategoryItemIds
) : ICommand<ReorderMenuItemsResult>;

public record ReorderMenuItemsResult(
    bool Success
);
