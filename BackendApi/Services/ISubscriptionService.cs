namespace BackendApi.Services;

public interface ISubscriptionService
{
    Task<bool> CanCreateRestaurantAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<bool> CanCreateMenuAsync(Guid restaurantId, CancellationToken cancellationToken = default);
    Task<int> GetMaxLocationsAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<int> GetMaxMenusPerLocationAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<bool> HasActiveSubscriptionAsync(Guid userId, CancellationToken cancellationToken = default);
}
