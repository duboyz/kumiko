import type { Meta, StoryObj } from '@storybook/react'
import { ProductionMenuBuilder } from './ProductionMenuBuilder'
import '../../../styles/globals.css'

const meta: Meta<typeof ProductionMenuBuilder> = {
  title: 'Components/MenuBuilder/ProductionMenuBuilder',
  component: ProductionMenuBuilder,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Production-ready menu builder with full API integration, data fetching, and state management. This component provides a complete interface for restaurant menu management including loading states, error handling, and menu creation flow.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ProductionMenuBuilder>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default production menu builder. In a real application, this would connect to your API and display actual restaurant menu data.',
      },
    },
  },
}

export const LoadingState: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Menu builder in loading state while fetching menu data from the API.',
      },
    },
  },
}

export const ErrorState: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Menu builder showing error state when API requests fail.',
      },
    },
  },
}

export const CreateMenuFlow: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Menu builder showing the create menu form when no menu exists for the restaurant.',
      },
    },
  },
}

export const Demo: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comprehensive demo of the production menu builder with all features enabled.',
      },
    },
  },
}