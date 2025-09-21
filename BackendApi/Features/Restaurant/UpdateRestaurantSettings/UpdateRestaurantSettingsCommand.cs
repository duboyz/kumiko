using BackendApi.Entities;
using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Restaurant.UpdateRestaurantSettings;

public record UpdateRestaurantSettingsCommand(
    Guid RestaurantId,
    Currency Currency
) : ICommand;