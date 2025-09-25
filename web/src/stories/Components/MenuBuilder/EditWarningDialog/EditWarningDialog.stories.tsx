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

export const EditMenuItem: Story = {
  args: {
    isOpen: true,
    editTarget: { type: 'item', id: '1', categoryId: '1' },
    onOpenChange: (open: boolean) => console.log('Dialog open changed:', open),
    onConfirmEdit: () => console.log('Edit menu item confirmed'),
  },
}

export const EditCategory: Story = {
  args: {
    isOpen: true,
    editTarget: { type: 'category', id: '1' },
    onOpenChange: (open: boolean) => console.log('Dialog open changed:', open),
    onConfirmEdit: () => console.log('Edit category confirmed'),
  },
}

export const Closed: Story = {
  args: {
    isOpen: false,
    editTarget: { type: 'item', id: '1', categoryId: '1' },
    onOpenChange: (open: boolean) => console.log('Dialog open changed:', open),
    onConfirmEdit: () => console.log('Edit confirmed'),
  },
}

export const InteractionDemo = () => {
  return (
    <div className="space-y-4 p-4">
      <div className="text-center space-y-4">
        <h3 className="text-lg font-semibold">Edit Warning Dialogs</h3>
        <p className="text-gray-600">
          Click the buttons below to see different edit warning scenarios
        </p>

        <div className="flex gap-4 justify-center">
          <button
            className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
            onClick={() => console.log('Would show edit menu item dialog')}
          >
            Edit Menu Item
          </button>
          <button
            className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
            onClick={() => console.log('Would show edit category dialog')}
          >
            Edit Category
          </button>
        </div>

        <p className="text-sm text-gray-500">
          In a real app, these buttons would open the respective dialogs
        </p>
      </div>

      {/* Show example of actual dialog */}
      <EditWarningDialog
        isOpen={true}
        editTarget={{ type: 'item', id: '1', categoryId: '1' }}
        onOpenChange={(open) => console.log('Demo dialog open changed:', open)}
        onConfirmEdit={() => console.log('Demo edit confirmed')}
      />
    </div>
  )
}