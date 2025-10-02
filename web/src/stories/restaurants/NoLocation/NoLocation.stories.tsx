import { StoryObj } from '@storybook/nextjs-vite'
import { NoLocation } from './NoLocation'

const meta = {
  title: 'Restaurants/NoLocation',
  component: NoLocation,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
}

export default meta

export const Default: StoryObj<typeof meta> = {}
