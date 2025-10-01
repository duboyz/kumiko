import { StoryObj } from '@storybook/nextjs-vite'
import { NoLocation } from './NoLocation'

const meta = {
  component: NoLocation,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
}

export default meta

export const Default: StoryObj<typeof meta> = {
  args: {
    title: 'No Location',
  },
}
