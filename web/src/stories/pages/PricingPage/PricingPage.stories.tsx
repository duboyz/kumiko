import type { Meta, StoryObj } from '@storybook/react'
import { PricingPage } from './PricingPage'

const meta: Meta<typeof PricingPage> = {
  title: 'Pages/PricingPage',
  component: PricingPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Dedicated pricing page with detailed plans, feature comparison, and FAQ section.',
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
