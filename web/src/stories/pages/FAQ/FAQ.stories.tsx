import type { Meta, StoryObj } from '@storybook/react'
import { FAQ } from './FAQ'

const meta: Meta<typeof FAQ> = {
  title: 'Pages/FAQ',
  component: FAQ,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Comprehensive FAQ page with searchable questions, categories, and expandable answers.',
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
