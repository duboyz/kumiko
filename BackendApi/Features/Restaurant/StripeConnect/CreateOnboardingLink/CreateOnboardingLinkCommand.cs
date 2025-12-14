using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Restaurant.StripeConnect.CreateOnboardingLink;

public record CreateOnboardingLinkCommand(Guid RestaurantId) : ICommand<CreateOnboardingLinkResult>;

