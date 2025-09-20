using BackendApi.Shared.Contracts;

namespace BackendApi.Features.RestaurantMenu.BulkDeleteMenuItems;

public record BulkDeleteMenuItemsCommand(
    Guid[] MenuItemIds
) : ICommand<BulkDeleteMenuItemsResult>;

public record BulkDeleteMenuItemsResult(
    int ItemsDeleted,
    int ItemsNotFound,
    string[] NotFoundReasons
);
