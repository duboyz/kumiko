using BackendApi.Models.Restaurant;
using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Restaurant.GetRestaurantById;

public record GetRestaurantByIdQuery(Guid Id) : IQuery<RestaurantBaseDto>;