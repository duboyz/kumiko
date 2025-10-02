import { StoryObj } from '@storybook/nextjs-vite'
import { RestaurantRequired } from './RestaurantRequired'

const meta = {
  title: 'Restaurants/RestaurantRequired',
  component: RestaurantRequired,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
