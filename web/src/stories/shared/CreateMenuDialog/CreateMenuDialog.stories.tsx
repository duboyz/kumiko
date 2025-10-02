import type { Meta, StoryObj } from '@storybook/react'
import { CreateMenuDialog } from './CreateMenuDialog'

const meta = {
  title: 'Shared/CreateMenuDialog',
  component: CreateMenuDialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CreateMenuDialog>

export default meta
type Story = StoryObj<typeof meta>

const mockRouter = {
  push: (path: string) => {
    console.log('Navigate to:', path)
  },
} as any

export const Default: Story = {
  args: {
    restaurantName: 'My Restaurant',
    router: mockRouter,
    triggerText: 'Create Menu',
    triggerVariant: 'default',
  },
}

export const Secondary: Story = {
  args: {
    restaurantName: 'Sushi Palace',
    router: mockRouter,
    triggerText: 'Add New Menu',
    triggerVariant: 'secondary',
  },
}

export const Outline: Story = {
  args: {
    restaurantName: 'Pizza House',
    router: mockRouter,
    triggerText: 'Create Menu',
    triggerVariant: 'outline',
  },
}
