using BackendApi.Shared.Contracts;

namespace BackendApi.Features.RestaurantMenu.DeleteMenuItem;

public record DeleteMenuItemCommand(
    Guid Id
) : ICommand<DeleteMenuItemResult>;

public record DeleteMenuItemResult(
    bool Success
);
