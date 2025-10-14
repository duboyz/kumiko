import type { Meta, StoryObj } from '@storybook/react'
import { RestaurantOnboarding } from './RestaurantOnboarding'

const meta: Meta<typeof RestaurantOnboarding> = {
  title: 'Onboarding/RestaurantOnboarding',
  component: RestaurantOnboarding,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Complete restaurant onboarding flow with 5 steps: Find Restaurant → Business Details → Business Hours → Import Menu → Choose Website Templates.',
      },
    },
  },
  argTypes: {
    onBack: {
      action: 'back',
      description: 'Callback when user goes back (not used in current flow)',
    },
    onComplete: {
      action: 'complete',
      description: 'Callback when onboarding is completed',
    },
  },
}

export default meta
type Story = StoryObj<typeof RestaurantOnboarding>

export const Default: Story = {
  args: {
    onBack: () => console.log('Back clicked'),
    onComplete: () => console.log('Onboarding completed'),
  },
  parameters: {
    docs: {
      description: {
        story:
          'The complete onboarding flow. Users can navigate through all 5 steps to set up their restaurant, import a menu, and create a website.',
      },
    },
  },
}

export const MobileView: Story = {
  args: {
    onBack: () => console.log('Back clicked'),
    onComplete: () => console.log('Onboarding completed'),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile view of the onboarding flow showing responsive design.',
      },
    },
  },
}

export const TabletView: Story = {
  args: {
    onBack: () => console.log('Back clicked'),
    onComplete: () => console.log('Onboarding completed'),
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Tablet view of the onboarding flow.',
      },
    },
  },
}

