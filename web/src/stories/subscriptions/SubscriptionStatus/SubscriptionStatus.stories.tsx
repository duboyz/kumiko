import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SubscriptionStatus } from './SubscriptionStatus'
import type { UserSubscriptionDto } from '@shared/types/subscription.types'

const trialSubscription: UserSubscriptionDto = {
  id: '1',
  plan: {
    id: '1',
    name: 'Basic',
    tier: 'Basic',
    monthlyPrice: 29.99,
    yearlyPrice: 299.99,
    maxLocations: 1,
    maxMenusPerLocation: 3,
  },
  status: 'Trialing',
  billingInterval: 'Monthly',
  trialStartDate: new Date().toISOString(),
  trialEndDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
  isTrialing: true,
  isActive: true,
  hasPaymentMethod: false, // Free trial without payment
}

const activeSubscription: UserSubscriptionDto = {
  id: '2',
  plan: {
    id: '2',
    name: 'Premium',
    tier: 'Premium',
    monthlyPrice: 79.99,
    yearlyPrice: 799.99,
    maxLocations: 3,
    maxMenusPerLocation: 3,
  },
  status: 'Active',
  billingInterval: 'Monthly',
  subscriptionStartDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  currentPeriodEnd: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
  isTrialing: false,
  isActive: true,
  hasPaymentMethod: true, // Paid subscription
}

const enterpriseSubscription: UserSubscriptionDto = {
  id: '3',
  plan: {
    id: '3',
    name: 'Enterprise',
    tier: 'Enterprise',
    monthlyPrice: 199.99,
    yearlyPrice: 1999.99,
    maxLocations: -1,
    maxMenusPerLocation: -1,
  },
  status: 'Active',
  billingInterval: 'Yearly',
  subscriptionStartDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  currentPeriodEnd: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000).toISOString(),
  isTrialing: false,
  isActive: true,
  hasPaymentMethod: true, // Paid subscription
}

const pastDueSubscription: UserSubscriptionDto = {
  ...activeSubscription,
  status: 'PastDue',
  isActive: false,
}

const meta = {
  title: 'Subscriptions/SubscriptionStatus',
  component: SubscriptionStatus,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    subscription: {
      description: 'User subscription details',
    },
    currentLocations: {
      control: 'number',
      description: 'Number of locations currently created',
    },
    currentMenus: {
      control: 'number',
      description: 'Total number of menus across all locations',
    },
  },
  args: {
    subscription: activeSubscription,
    currentLocations: 1,
    currentMenus: 2,
  },
} satisfies Meta<typeof SubscriptionStatus>

export default meta

type Story = StoryObj<typeof meta>

export const BasicTrial: Story = {
  args: {
    subscription: trialSubscription,
    currentLocations: 1,
    currentMenus: 2,
  },
}

export const BasicTrialNearLimit: Story = {
  args: {
    subscription: trialSubscription,
    currentLocations: 1,
    currentMenus: 3,
  },
}

export const PremiumActive: Story = {
  args: {
    subscription: activeSubscription,
    currentLocations: 2,
    currentMenus: 5,
  },
}

export const PremiumNearLocationLimit: Story = {
  args: {
    subscription: activeSubscription,
    currentLocations: 3,
    currentMenus: 8,
  },
}

export const EnterpriseUnlimited: Story = {
  args: {
    subscription: enterpriseSubscription,
    currentLocations: 10,
    currentMenus: 50,
  },
}

export const PastDue: Story = {
  args: {
    subscription: pastDueSubscription,
    currentLocations: 2,
    currentMenus: 5,
  },
}

export const YearlyBilling: Story = {
  args: {
    subscription: {
      ...activeSubscription,
      billingInterval: 'Yearly',
      currentPeriodEnd: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000).toISOString(),
      hasPaymentMethod: true,
    },
    currentLocations: 2,
    currentMenus: 4,
  },
}
