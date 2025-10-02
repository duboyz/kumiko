import { StoryObj } from '@storybook/nextjs-vite'
import { ContentNotFound } from './ContentNotFound'

const meta = {
  title: 'Shared/ContentNotFound',
  component: ContentNotFound,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    onBackClick: { action: 'back clicked' },
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const MenuNotFound: Story = {
  args: {
    title: 'Menu Not Found',
    message: "The menu you're looking for doesn't exist or you don't have access to it.",
    backToText: 'Back to Menus',
    backToLink: '/menus',
  },
}

export const RestaurantNotFound: Story = {
  args: {
    title: 'Restaurant Not Found',
    message: "The restaurant you're looking for doesn't exist or has been removed.",
    backToText: 'Back to Restaurants',
    backToLink: '/restaurants',
  },
}

export const PageNotFound: Story = {
  args: {
    title: 'Page Not Found',
    message: "The page you're looking for doesn't exist or has been moved.",
    backToText: 'Back to Home',
    backToLink: '/',
  },
}

export const ItemNotFound: Story = {
  args: {
    title: 'Item Not Found',
    message: "The item you're trying to access is no longer available.",
    backToText: 'Go Back',
    backToLink: '/dashboard',
  },
}
