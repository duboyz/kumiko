import type { Meta, StoryObj } from '@storybook/react'
import { PrivacyPolicy } from './PrivacyPolicy'

const meta: Meta<typeof PrivacyPolicy> = {
  title: 'Pages/PrivacyPolicy',
  component: PrivacyPolicy,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Privacy Policy page explaining data collection, usage, and protection practices.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
