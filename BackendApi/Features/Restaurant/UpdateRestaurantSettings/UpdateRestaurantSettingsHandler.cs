using BackendApi.Repositories;
using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Restaurant.UpdateRestaurantSettings;

public class UpdateRestaurantSettingsHandler(IRestaurantRepository restaurantRepository) : ICommandHandler<UpdateRestaurantSettingsCommand>
{
    public async Task Handle(UpdateRestaurantSettingsCommand request, CancellationToken cancellationToken)
    {
        var restaurant = await restaurantRepository.GetByIdAsync(request.RestaurantId);
        if (restaurant == null)
        {
            throw new KeyNotFoundException("Restaurant not found");
        }

        Console.WriteLine($"Restaurant updated {request.Currency}");

        restaurant.Currency = request.Currency;
        restaurant.UpdatedAt = DateTime.UtcNow;
        await restaurantRepository.UpdateAsync(restaurant);
    }
}