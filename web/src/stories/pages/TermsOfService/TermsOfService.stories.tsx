import type { Meta, StoryObj } from '@storybook/react'
import { TermsOfService } from './TermsOfService'

const meta: Meta<typeof TermsOfService> = {
  title: 'Pages/TermsOfService',
  component: TermsOfService,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Terms of Service page with clear, simple legal terms for using Kumiko.',
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
