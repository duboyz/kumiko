import { Meta, StoryObj } from '@storybook/nextjs-vite'
import { CreateWebPageModal } from './CreateWebPageModal'

const meta = {
  component: CreateWebPageModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onPageCreate: { action: 'pageCreate' },
  },
} satisfies Meta<typeof CreateWebPageModal>

export default meta

type Story = StoryObj<typeof CreateWebPageModal>

export const Default: Story = {
  args: {
    websiteId: 'website-123',
    restaurantName: 'Bella Vista Restaurant',
    existingSlugs: [],
  },
}

export const WithDifferentRestaurant: Story = {
  args: {
    websiteId: 'website-456',
    restaurantName: 'Ocean View Café',
    existingSlugs: ['home', 'about'],
  },
}

export const Loading: Story = {
  args: {
    websiteId: 'website-123',
    restaurantName: 'Bella Vista Restaurant',
    existingSlugs: [],
    isLoading: true,
  },
}
