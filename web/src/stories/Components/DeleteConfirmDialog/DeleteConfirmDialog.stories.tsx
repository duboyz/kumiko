import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { DeleteConfirmDialog } from './DeleteConfirmDialog'


const meta: Meta<typeof DeleteConfirmDialog> = {
  component: DeleteConfirmDialog,
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
    onConfirmDelete: {
      action: 'delete confirmed',
      description: 'Function called when deletion is confirmed',
    },
  },
}

export default meta

type Story = StoryObj<typeof DeleteConfirmDialog>

export const Default: Story = {
  args: {
    isOpen: true,
    content: 'Are you sure you want to delete this menu item? This action cannot be undone.',
    onOpenChange: (open: boolean) => console.log('Dialog open changed:', open),
    onConfirmDelete: () => console.log('Delete menu item confirmed'),
  },
}
