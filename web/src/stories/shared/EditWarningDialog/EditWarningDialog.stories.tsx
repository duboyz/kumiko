import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { EditWarningDialog } from './EditWarningDialog'

const meta: Meta<typeof EditWarningDialog> = {
  component: EditWarningDialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Whether the dialog is open',
    },
    onOpenChange: {
      action: 'open changed',
      description: 'Function called when dialog open state changes',
    },
    onConfirmEdit: {
      action: 'edit confirmed',
      description: 'Function called when edit is confirmed',
    },
  },
}

export default meta

type Story = StoryObj<typeof EditWarningDialog>

export const Default: Story = {
  args: {
    isOpen: true,
    content: 'Are you sure you want to edit this menu item? This action cannot be undone.',
    onOpenChange: (open: boolean) => console.log('Dialog open changed:', open),
    onConfirmEdit: () => console.log('Edit menu item confirmed'),
  },
}
