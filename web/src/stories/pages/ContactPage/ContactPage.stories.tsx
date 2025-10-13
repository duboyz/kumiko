import type { Meta, StoryObj } from '@storybook/react'
import { ContactPage } from './ContactPage'

const meta: Meta<typeof ContactPage> = {
  title: 'Pages/ContactPage',
  component: ContactPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The Contact Us page with contact form, contact information, and FAQ section.',
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
