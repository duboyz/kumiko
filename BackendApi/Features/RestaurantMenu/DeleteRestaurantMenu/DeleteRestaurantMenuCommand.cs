using BackendApi.Shared.Contracts;

namespace BackendApi.Features.RestaurantMenu.DeleteRestaurantMenu;

public record DeleteRestaurantMenuCommand(
    Guid Id
) : ICommand<DeleteRestaurantMenuResult>;

public record DeleteRestaurantMenuResult(
    bool Success
);
