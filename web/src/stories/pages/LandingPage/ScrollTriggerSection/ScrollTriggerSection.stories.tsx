import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ScrollTriggerSection } from './ScrollTriggerSection'

const meta = {
  component: ScrollTriggerSection,
  parameters: {
    layout: 'fullscreen',
  },
  args: {},
} satisfies Meta<typeof ScrollTriggerSection>

export default meta

export const Default: StoryObj<typeof meta> = {
  args: {},
}
