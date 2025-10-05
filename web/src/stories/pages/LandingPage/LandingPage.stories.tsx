import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { LandingPage } from './LandingPage'

const meta = {
  title: 'Pages/LandingPage',
  component: LandingPage,
  parameters: {
    layout: 'fullscreen',
  },
  args: {},
} satisfies Meta<typeof LandingPage>

export default meta

export const Default: StoryObj<typeof meta> = {
  args: {},
}
