import type { Meta, StoryObj } from '@storybook/react'
import { MenuImportWizard } from './MenuImportWizard'

const meta: Meta<typeof MenuImportWizard> = {
  title: 'Onboarding/MenuImportWizard',
  component: MenuImportWizard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Complete menu import wizard with 4 steps: Upload → Annotate → Process → Review. Uses the same flow as the main menu import feature.',
      },
    },
  },
  argTypes: {
    restaurantId: {
      control: 'text',
      description: 'The restaurant ID for menu creation',
    },
    onMenuCreated: {
      action: 'menu-created',
      description: 'Callback when menu is successfully created',
    },
    onSkip: {
      action: 'skip',
      description: 'Callback when user skips menu import',
    },
    onBack: {
      action: 'back',
      description: 'Callback when user goes back to previous step',
    },
  },
}

export default meta
type Story = StoryObj<typeof MenuImportWizard>

export const Default: Story = {
  args: {
    restaurantId: 'restaurant-123',
    onMenuCreated: (menuId: string) => console.log('Menu created:', menuId),
    onSkip: () => console.log('Skipped menu import'),
    onBack: () => console.log('Back clicked'),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Complete menu import flow with all 4 steps. Users can upload an image, annotate menu areas, process with AI, and review the results before creating the menu.',
      },
    },
  },
}

export const WithMockRestaurant: Story = {
  args: {
    restaurantId: 'mock-restaurant-id',
    onMenuCreated: (menuId: string) => console.log('Menu created:', menuId),
    onSkip: () => console.log('Skipped menu import'),
    onBack: () => console.log('Back clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Example with a mock restaurant ID for testing purposes.',
      },
    },
  },
}
