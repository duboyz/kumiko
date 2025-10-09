import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { HeroSection } from './HeroSection'

const meta = {
  title: 'Pages/LandingPage/HeroSection',
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
