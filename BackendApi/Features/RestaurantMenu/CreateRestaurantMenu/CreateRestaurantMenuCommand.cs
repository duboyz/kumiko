using BackendApi.Shared.Contracts;

namespace BackendApi.Features.RestaurantMenu.CreateRestaurantMenu;

public record CreateRestaurantMenuCommand(
    string Name,
    string Description,
    Guid RestaurantId
) : ICommand<CreateRestaurantMenuResult>;

public record CreateRestaurantMenuResult(
    Guid Id,
    string Name,
    string Description,
    Guid RestaurantId
);
