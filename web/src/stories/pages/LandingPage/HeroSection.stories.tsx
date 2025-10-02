import { HeroSection } from './HeroSection'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'

const meta = {
  component: HeroSection,
  parameters: {
    layout: 'fullscreen',
  },
  args: {},
} satisfies Meta<typeof HeroSection>

export default meta

export const Default: StoryObj<typeof meta> = {
  args: {},
}
