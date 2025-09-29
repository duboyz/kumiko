using BackendApi.Shared.Contracts;

namespace BackendApi.Features.RestaurantMenu.UpdateTitleAndDescription;

public record UpdateRestaurantMenuCommand(
    Guid Id,
    string Name,
    string Description
) : ICommand<UpdateRestaurantMenuResult>;

public record UpdateRestaurantMenuResult(
    Guid Id,
    string Name,
    string Description,
    Guid RestaurantId
);
