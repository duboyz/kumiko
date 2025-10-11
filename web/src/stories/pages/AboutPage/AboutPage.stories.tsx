import type { Meta, StoryObj } from '@storybook/react'
import { AboutPage } from './AboutPage'

const meta: Meta<typeof AboutPage> = {
  title: 'Pages/AboutPage',
  component: AboutPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The About Us page showcasing company story, mission, values, and team.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
