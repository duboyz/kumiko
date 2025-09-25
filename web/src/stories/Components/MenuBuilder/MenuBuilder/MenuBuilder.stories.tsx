import type { Meta, StoryObj } from '@storybook/react'
import { MenuBuilder } from './MenuBuilder'
import '../../../styles/globals.css'

const meta: Meta<typeof MenuBuilder> = {
  title: 'Components/MenuBuilder/MenuBuilder',
  component: MenuBuilder,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A complete menu building interface with drag-and-drop functionality, category management, and item management. Allows users to create, edit, and organize restaurant menu categories and items.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof MenuBuilder>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default menu builder with sample categories and items. Includes drag-and-drop functionality for reordering categories and items.',
      },
    },
  },
}

export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo of the menu builder. Try adding new categories, editing existing ones, and managing menu items.',
      },
    },
  },
}

export const Demo: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Comprehensive demo showcasing all features of the menu builder including category management, item management, and drag-and-drop reordering.',
      },
    },
  },
}