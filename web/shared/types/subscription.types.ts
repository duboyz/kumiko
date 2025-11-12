// Subscription Types - Must match backend C# types exactly

export interface GetSubscriptionPlansQuery {}

export interface GetSubscriptionPlansResult {
  plans: SubscriptionPlanDto[]
}

export interface SubscriptionPlanDto {
  id: string
  name: string
  tier: 'Basic' | 'Premium' | 'Enterprise'
  monthlyPrice: number
  yearlyPrice: number
  maxLocations: number
  maxMenusPerLocation: number
  isActive: boolean
}

export interface CreateCheckoutSessionCommand {
  subscriptionPlanId: string
  billingInterval: 'Monthly' | 'Yearly'
  skipTrial?: boolean
}

export interface CreateCheckoutSessionResult {
  sessionId: string
  sessionUrl: string
}

export interface GetUserSubscriptionQuery {}

export interface GetUserSubscriptionResult {
  subscription: UserSubscriptionDto | null
}

export interface UserSubscriptionDto {
  id: string
  plan: UserSubscriptionPlanDto
  status: 'Trialing' | 'Active' | 'Canceled' | 'PastDue' | 'Expired'
  billingInterval: 'Monthly' | 'Yearly'
  trialStartDate?: string
  trialEndDate?: string
  subscriptionStartDate?: string
  subscriptionEndDate?: string
  currentPeriodStart?: string
  currentPeriodEnd?: string
  isTrialing: boolean
  isActive: boolean
  hasPaymentMethod: boolean
}

export interface UserSubscriptionPlanDto {
  id: string
  name: string
  tier: string
  monthlyPrice: number
  yearlyPrice: number
  maxLocations: number
  maxMenusPerLocation: number
}

export interface CancelSubscriptionCommand {}

export interface CancelSubscriptionResult {
  success: boolean
  message: string
}

// Usage Statistics
export interface GetUsageStatsQuery {}

export interface GetUsageStatsResult {
  currentLocations: number
  maxLocations: number
  currentMenusPerLocation: number
  maxMenusPerLocation: number
  isUnlimitedLocations: boolean
  isUnlimitedMenus: boolean
}
