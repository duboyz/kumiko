import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { FlyingCards } from './FlyingCards'

const meta = {
  component: FlyingCards,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#000000',
        },
      ],
    },
  },
  args: {},
} satisfies Meta<typeof FlyingCards>

export default meta

export const Default: StoryObj<typeof meta> = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Flying cards component with GSAP ScrollTrigger animations. Cards fly in from the sides as you scroll.',
      },
    },
  },
}
