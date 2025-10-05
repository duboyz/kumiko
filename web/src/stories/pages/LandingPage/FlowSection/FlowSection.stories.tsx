import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { FlowSection } from './FlowSection'

const meta = {
  component: FlowSection,
  parameters: {
    title: 'Pages/LandingPage/FlowSection',
    layout: 'fullscreen',
  },
  args: {},
} satisfies Meta<typeof FlowSection>

export default meta

export const Default: StoryObj<typeof meta> = {
  args: {},
}
