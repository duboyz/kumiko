using BackendApi.Shared.Contracts;

namespace BackendApi.Features.RestaurantMenu.BulkAddMenuItemsToCategory;

public record BulkAddMenuItemsToCategoryCommand(
    Guid[] MenuItemIds,
    Guid MenuCategoryId,
    int StartOrderIndex = 0
) : ICommand<BulkAddMenuItemsToCategoryResult>;

public record BulkAddMenuItemsToCategoryResult(
    Guid[] CreatedCategoryItemIds,
    int ItemsAdded,
    int ItemsSkipped,
    string[] SkippedReasons
);
