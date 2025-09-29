import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { CreateMenuForm } from './CreateMenuForm'

const meta: Meta<typeof CreateMenuForm> = {
  component: CreateMenuForm,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    isLoading: {
      control: 'boolean',
      description: 'Whether the form is in loading state',
    },
    restaurantName: {
      control: 'text',
      description: 'Name of the restaurant',
    },
    restaurantId: {
      control: 'text',
      description: 'ID of the restaurant',
    },
    onCreateMenu: {
      action: 'menu created',
      description: 'Function called when menu is created',
    },
  },
}

export default meta

type Story = StoryObj<typeof CreateMenuForm>

export const Default: Story = {
  args: {
    restaurantId: '1',
    restaurantName: 'Bella Vista Restaurant',
    onCreateMenu: (menuData) => console.log('Create menu:', menuData),
    isLoading: false,
  },
}
