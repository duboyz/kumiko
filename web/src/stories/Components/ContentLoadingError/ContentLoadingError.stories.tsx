import { StoryObj } from '@storybook/nextjs-vite'
import { ContentLoadingError } from './ContentLoadingError'

const meta = {
  component: ContentLoadingError,
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

export const ErrorLoadingMenu: Story = {
  args: {
    title: 'Error Loading Menu',
    message: 'There was an error loading the menu. Please try again later.',
    backToText: 'Back to Menus',
    backToLink: '/menus',
  },
}

export const ErrorLoadingRestaurant: Story = {
  args: {
    title: 'Error Loading Restaurant',
    message: 'Unable to load restaurant information. Please check your connection and try again.',
    backToText: 'Back to Dashboard',
    backToLink: '/dashboard',
  },
}

export const ErrorLoadingData: Story = {
  args: {
    title: 'Data Unavailable',
    message: 'The requested data could not be loaded at this time.',
    backToText: 'Go Back',
    backToLink: '/',
  },
}
