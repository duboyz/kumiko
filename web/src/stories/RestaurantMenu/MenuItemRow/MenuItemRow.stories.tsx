import { Meta, StoryObj } from '@storybook/nextjs-vite'
import { MenuItemRow } from './MenuItemRow'

const meta = {
  component: MenuItemRow,
  argTypes: {},
  args: {},
} satisfies Meta<typeof MenuItemRow>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
