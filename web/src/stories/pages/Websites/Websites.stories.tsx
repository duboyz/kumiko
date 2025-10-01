import { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Websites } from './Websites'

const meta = {
  component: Websites,
} satisfies Meta<typeof Websites>

export default meta

type Story = StoryObj<typeof Websites>

export const Default: Story = {
  args: {},
}
