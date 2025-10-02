import { StoryObj } from '@storybook/nextjs-vite'
import { RestaurantMenus } from './RestaurantMenus'
import { mockMenus, singleMenu, emptyMenus } from '@/stories/__mocks__'

const meta = {
  component: RestaurantMenus,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof meta>

export const MultipleMenus: Story = {
  args: {
    menus: mockMenus,
    locationName: 'Bella Vista Restaurant',
  },
}

export const SingleMenu: Story = {
  args: {
    menus: singleMenu,
    locationName: 'Bella Vista Restaurant',
  },
}

export const NoMenus: Story = {
  args: {
    menus: emptyMenus,
    locationName: 'New Restaurant',
  },
}

export const Loading: Story = {
  args: {
    isLoading: true,
    locationName: 'Bella Vista Restaurant',
  },
}

export const ErrorState: Story = {
  args: {
    error: new Error('Failed to load menus'),
    locationName: 'Bella Vista Restaurant',
  },
}
