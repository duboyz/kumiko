using BackendApi.Shared.Contracts;

namespace BackendApi.Features.RestaurantMenu.DeleteMenuItemAdditionalOption;

public record DeleteMenuItemAdditionalOptionCommand(
    Guid Id
) : ICommand<DeleteMenuItemAdditionalOptionResult>;

public record DeleteMenuItemAdditionalOptionResult(
    bool Success
);

