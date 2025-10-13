import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { PricingCard } from './PricingCard'
import type { SubscriptionPlanDto } from '@shared/types/subscription.types'

const basicPlan: SubscriptionPlanDto = {
  id: '1',
  name: 'Basic',
  tier: 'Basic',
  monthlyPrice: 29.99,
  yearlyPrice: 299.99,
  maxLocations: 1,
  maxMenusPerLocation: 3,
  isActive: true,
}

const premiumPlan: SubscriptionPlanDto = {
  id: '2',
  name: 'Premium',
  tier: 'Premium',
  monthlyPrice: 79.99,
  yearlyPrice: 799.99,
  maxLocations: 3,
  maxMenusPerLocation: 3,
  isActive: true,
}

const enterprisePlan: SubscriptionPlanDto = {
  id: '3',
  name: 'Enterprise',
  tier: 'Enterprise',
  monthlyPrice: 199.99,
  yearlyPrice: 1999.99,
  maxLocations: -1,
  maxMenusPerLocation: -1,
  isActive: true,
}

const meta = {
  title: 'Subscriptions/PricingCard',
  component: PricingCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    plan: {
      description: 'Subscription plan details',
    },
    billingInterval: {
      control: 'radio',
      options: ['Monthly', 'Yearly'],
      description: 'Billing interval',
    },
    isCurrentPlan: {
      control: 'boolean',
      description: 'Whether this is the current plan',
    },
    isPopular: {
      control: 'boolean',
      description: 'Whether to show popular badge',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state',
    },
  },
  args: {
    plan: premiumPlan,
    billingInterval: 'Monthly',
    isCurrentPlan: false,
    isPopular: false,
    loading: false,
    onSelect: () => console.log('Plan selected'),
  },
} satisfies Meta<typeof PricingCard>

export default meta

type Story = StoryObj<typeof meta>

export const BasicMonthly: Story = {
  args: {
    plan: basicPlan,
    billingInterval: 'Monthly',
  },
}

export const BasicYearly: Story = {
  args: {
    plan: basicPlan,
    billingInterval: 'Yearly',
  },
}

export const PremiumMonthly: Story = {
  args: {
    plan: premiumPlan,
    billingInterval: 'Monthly',
    isPopular: true,
  },
}

export const PremiumYearly: Story = {
  args: {
    plan: premiumPlan,
    billingInterval: 'Yearly',
    isPopular: true,
  },
}

export const EnterpriseMonthly: Story = {
  args: {
    plan: enterprisePlan,
    billingInterval: 'Monthly',
  },
}

export const EnterpriseYearly: Story = {
  args: {
    plan: enterprisePlan,
    billingInterval: 'Yearly',
  },
}

export const CurrentPlan: Story = {
  args: {
    plan: premiumPlan,
    billingInterval: 'Monthly',
    isCurrentPlan: true,
  },
}

export const Loading: Story = {
  args: {
    plan: premiumPlan,
    billingInterval: 'Monthly',
    loading: true,
  },
}

export const AllPlansMonthly: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 max-w-6xl">
      <PricingCard
        plan={basicPlan}
        billingInterval="Monthly"
        onSelect={() => console.log('Basic selected')}
      />
      <PricingCard
        plan={premiumPlan}
        billingInterval="Monthly"
        isPopular
        onSelect={() => console.log('Premium selected')}
      />
      <PricingCard
        plan={enterprisePlan}
        billingInterval="Monthly"
        onSelect={() => console.log('Enterprise selected')}
      />
    </div>
  ),
}

export const AllPlansYearly: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 max-w-6xl">
      <PricingCard
        plan={basicPlan}
        billingInterval="Yearly"
        onSelect={() => console.log('Basic selected')}
      />
      <PricingCard
        plan={premiumPlan}
        billingInterval="Yearly"
        isPopular
        onSelect={() => console.log('Premium selected')}
      />
      <PricingCard
        plan={enterprisePlan}
        billingInterval="Yearly"
        onSelect={() => console.log('Enterprise selected')}
      />
    </div>
  ),
}
