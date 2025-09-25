import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { DeleteConfirmDialog } from './DeleteConfirmDialog'

// Mock category data
const mockCategories = [
  {
    id: '1',
    name: 'Appetizers',
    description: 'Light starters',
    sortOrder: 1,
    menuCategoryItems: [
      { id: '1', name: 'Bruschetta', description: 'Toasted bread with tomatoes', price: 8.99 },
      { id: '2', name: 'Calamari', description: 'Fried squid rings', price: 12.99 },
      { id: '3', name: 'Wings', description: 'Buffalo chicken wings', price: 10.99 },
    ]
  },
  {
    id: '2',
    name: 'Main Courses',
    description: 'Hearty entrees',
    sortOrder: 2,
    menuCategoryItems: [
      { id: '4', name: 'Grilled Salmon', description: 'Fresh Atlantic salmon', price: 24.99 },
      { id: '5', name: 'Ribeye Steak', description: '12oz prime cut', price: 32.99 },
    ]
  }
]

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

export const DeleteMenuItem: Story = {
  args: {
    isOpen: true,
    deleteTarget: { type: 'item', id: '1', categoryId: '1' },
    categories: mockCategories,
    onOpenChange: (open: boolean) => console.log('Dialog open changed:', open),
    onConfirmDelete: () => console.log('Delete menu item confirmed'),
  },
}

export const DeleteCategoryWithFewItems: Story = {
  args: {
    isOpen: true,
    deleteTarget: { type: 'category', id: '2' },
    categories: mockCategories,
    onOpenChange: (open: boolean) => console.log('Dialog open changed:', open),
    onConfirmDelete: () => console.log('Delete category confirmed'),
  },
}

export const DeleteCategoryWithManyItems: Story = {
  args: {
    isOpen: true,
    deleteTarget: { type: 'category', id: '1' },
    categories: mockCategories,
    onOpenChange: (open: boolean) => console.log('Dialog open changed:', open),
    onConfirmDelete: () => console.log('Delete category confirmed'),
  },
}

export const DeleteEmptyCategory: Story = {
  args: {
    isOpen: true,
    deleteTarget: { type: 'category', id: '3' },
    categories: [
      ...mockCategories,
      {
        id: '3',
        name: 'Desserts',
        description: 'Sweet treats',
        sortOrder: 3,
        menuCategoryItems: []
      }
    ],
    onOpenChange: (open: boolean) => console.log('Dialog open changed:', open),
    onConfirmDelete: () => console.log('Delete empty category confirmed'),
  },
}

export const Closed: Story = {
  args: {
    isOpen: false,
    deleteTarget: { type: 'item', id: '1', categoryId: '1' },
    categories: mockCategories,
    onOpenChange: (open: boolean) => console.log('Dialog open changed:', open),
    onConfirmDelete: () => console.log('Delete confirmed'),
  },
}

export const InteractionDemo = () => {
  return (
    <div className="space-y-4 p-4">
      <div className="text-center space-y-4">
        <h3 className="text-lg font-semibold">Delete Confirmation Dialogs</h3>
        <p className="text-gray-600">
          Click the buttons below to see different delete confirmation scenarios
        </p>

        <div className="flex gap-4 justify-center">
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => console.log('Would show delete menu item dialog')}
          >
            Delete Menu Item
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => console.log('Would show delete category dialog')}
          >
            Delete Category (3 items)
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => console.log('Would show delete empty category dialog')}
          >
            Delete Empty Category
          </button>
        </div>

        <p className="text-sm text-gray-500">
          In a real app, these buttons would open the respective dialogs
        </p>
      </div>

      {/* Show example of actual dialog */}
      <DeleteConfirmDialog
        isOpen={true}
        deleteTarget={{ type: 'category', id: '1' }}
        categories={mockCategories}
        onOpenChange={(open) => console.log('Demo dialog open changed:', open)}
        onConfirmDelete={() => console.log('Demo delete confirmed')}
      />
    </div>
  )
}