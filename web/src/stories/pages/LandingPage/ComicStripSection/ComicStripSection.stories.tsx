import type { Meta, StoryObj } from '@storybook/react'
import { ComicStripSection } from './ComicStripSection'

const meta: Meta<typeof ComicStripSection> = {
  title: 'Pages/LandingPage/ComicStripSection',
  component: ComicStripSection,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof ComicStripSection>

export const Default: Story = {}
