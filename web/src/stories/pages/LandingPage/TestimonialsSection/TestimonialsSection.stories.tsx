import type { Meta, StoryObj } from '@storybook/react'
import { TestimonialsSection } from './TestimonialsSection'

const meta: Meta<typeof TestimonialsSection> = {
  title: 'Pages/LandingPage/TestimonialsSection',
  component: TestimonialsSection,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof TestimonialsSection>

export const Default: Story = {}