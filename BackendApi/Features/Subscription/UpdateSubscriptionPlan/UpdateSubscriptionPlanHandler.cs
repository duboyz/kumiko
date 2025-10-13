using BackendApi.Data;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.Subscription.UpdateSubscriptionPlan;

public class UpdateSubscriptionPlanHandler(ApplicationDbContext context)
    : ICommandHandler<UpdateSubscriptionPlanCommand, UpdateSubscriptionPlanResult>
{
    public async Task<UpdateSubscriptionPlanResult> Handle(UpdateSubscriptionPlanCommand request, CancellationToken cancellationToken)
    {
        var plan = await context.SubscriptionPlans
            .FirstOrDefaultAsync(p => p.Id == request.PlanId, cancellationToken);

        if (plan == null)
        {
            return new UpdateSubscriptionPlanResult(false, "Subscription plan not found");
        }

        if (!string.IsNullOrEmpty(request.StripePriceIdMonthly))
        {
            plan.StripePriceIdMonthly = request.StripePriceIdMonthly;
        }

        if (!string.IsNullOrEmpty(request.StripePriceIdYearly))
        {
            plan.StripePriceIdYearly = request.StripePriceIdYearly;
        }

        await context.SaveChangesAsync(cancellationToken);

        return new UpdateSubscriptionPlanResult(true, $"Updated Stripe price IDs for {plan.Name} plan");
    }
}
