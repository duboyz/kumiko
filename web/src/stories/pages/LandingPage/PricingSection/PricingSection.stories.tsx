import type { Meta, StoryObj } from '@storybook/react'
import { PricingSection } from './PricingSection'

const meta: Meta<typeof PricingSection> = {
  title: 'Pages/LandingPage/PricingSection',
  component: PricingSection,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof PricingSection>

export const Default: Story = {}