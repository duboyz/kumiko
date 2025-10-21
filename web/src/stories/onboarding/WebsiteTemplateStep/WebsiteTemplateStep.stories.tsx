import type { Meta, StoryObj } from '@storybook/react'
import { WebsiteTemplateStep } from './WebsiteTemplateStep'

const meta: Meta<typeof WebsiteTemplateStep> = {
  title: 'Onboarding/WebsiteTemplateStep',
  component: WebsiteTemplateStep,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Step 5 of the onboarding flow - simple choice between Full Website (Home, Menu, About, Contact) or Menu Page Only.',
      },
    },
  },
  argTypes: {
    onTemplatesSelected: {
      action: 'templates-selected',
      description: 'Callback when templates are selected',
    },
    onSkip: {
      action: 'skip',
      description: 'Callback when user skips website setup',
    },
    selectedMenuId: {
      control: 'text',
      description: 'Menu ID if menu was imported (enables Menu Page template)',
    },
  },
}

export default meta
type Story = StoryObj<typeof WebsiteTemplateStep>

export const Default: Story = {
  args: {
    onTemplatesSelected: templates => console.log('Templates selected:', templates),
    onSkip: () => console.log('Skipped website setup'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Simple website selection with two clear options: Full Website or Menu Page Only.',
      },
    },
  },
}

export const WithMenuImported: Story = {
  args: {
    selectedMenuId: 'menu-123',
    onTemplatesSelected: templates => console.log('Templates selected:', templates),
    onSkip: () => console.log('Skipped website setup'),
  },
  parameters: {
    docs: {
      description: {
        story:
          'When a menu has been imported, both options are available. Full Website includes Home, Menu, About, and Contact pages. Menu Page Only creates just a menu page.',
      },
    },
  },
}

export const NoMenuImported: Story = {
  args: {
    selectedMenuId: undefined,
    onTemplatesSelected: templates => console.log('Templates selected:', templates),
    onSkip: () => console.log('Skipped website setup'),
  },
  parameters: {
    docs: {
      description: {
        story:
          'When no menu has been imported, only the Full Website option is available (without menu page). Menu Page Only option is disabled.',
      },
    },
  },
}
