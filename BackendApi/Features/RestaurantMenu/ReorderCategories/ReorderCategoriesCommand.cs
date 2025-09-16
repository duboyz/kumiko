using BackendApi.Shared.Contracts;

namespace BackendApi.Features.RestaurantMenu.ReorderCategories;

public record ReorderCategoriesCommand(
    List<Guid> CategoryIds
) : ICommand<ReorderCategoriesResult>;

public record ReorderCategoriesResult(
    bool Success
);
