import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { CreateMenuDialog } from './CreateMenuDialog'

const meta = {
  component: CreateMenuDialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CreateMenuDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    restaurantName: 'My Restaurant',
    triggerText: 'Create Menu',
    triggerVariant: 'default',
  },
}

export const Secondary: Story = {
  args: {
    restaurantName: 'Sushi Palace',
    triggerText: 'Add New Menu',
    triggerVariant: 'secondary',
  },
}

export const Outline: Story = {
  args: {
    restaurantName: 'Pizza House',
    triggerText: 'Create Menu',
    triggerVariant: 'outline',
  },
}
