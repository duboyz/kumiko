import type { Meta, StoryObj } from '@storybook/react'
import { FeaturesSection } from './FeaturesSection'

const meta: Meta<typeof FeaturesSection> = {
  title: 'Pages/LandingPage/FeaturesSection',
  component: FeaturesSection,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof FeaturesSection>

export const Default: Story = {}