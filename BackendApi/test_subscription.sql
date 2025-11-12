-- Check if subscription plans have price IDs
SELECT
    "Name",
    "Tier",
    "StripePriceIdMonthly",
    "StripePriceIdYearly"
FROM "SubscriptionPlans";

-- Check if any user subscriptions exist
SELECT
    u."Email",
    s."Status",
    s."TrialStartDate",
    s."TrialEndDate",
    s."StripeSubscriptionId",
    sp."Name" as "PlanName"
FROM "UserSubscriptions" s
JOIN "Users" u ON s."UserId" = u."Id"
JOIN "SubscriptionPlans" sp ON s."SubscriptionPlanId" = sp."Id"
ORDER BY s."CreatedAt" DESC
LIMIT 10;