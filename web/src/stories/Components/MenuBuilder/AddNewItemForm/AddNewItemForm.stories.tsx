import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { AddNewItemForm } from './AddNewItemForm'
import { Table, TableHeader, TableBody, TableRow, TableHead } from '@/components/ui/table'

const mockNewItem = {
  name: '',
  description: '',
  price: 0,
  isAvailable: true,
  restaurantMenuId: '1',
  categoryId: '1'
}

const mockFilledItem = {
  name: 'New Pasta Dish',
  description: 'Fresh homemade pasta with marinara sauce',
  price: 16.99,
  isAvailable: true,
  restaurantMenuId: '1',
  categoryId: '1'
}

const meta: Meta<typeof AddNewItemForm> = {
  component: AddNewItemForm,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Available</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <Story />
        </TableBody>
      </Table>
    ),
  ],
  argTypes: {
    onUpdateItem: {
      action: 'item updated',
      description: 'Function called when item fields are updated',
    },
    onSave: {
      action: 'save clicked',
      description: 'Function called when save is clicked',
    },
    onCancel: {
      action: 'cancel clicked',
      description: 'Function called when cancel is clicked',
    },
  },
}

export default meta

type Story = StoryObj<typeof AddNewItemForm>

export const Empty: Story = {
  args: {
    newItem: mockNewItem,
    onUpdateItem: (updates) => console.log('Update item:', updates),
    onSave: () => console.log('Save item'),
    onCancel: () => console.log('Cancel'),
  },
}

export const PartiallyFilled: Story = {
  args: {
    newItem: { ...mockNewItem, name: 'Chicken Alfredo', price: 18.99 },
    onUpdateItem: (updates) => console.log('Update item:', updates),
    onSave: () => console.log('Save item'),
    onCancel: () => console.log('Cancel'),
  },
}

export const CompletelyFilled: Story = {
  args: {
    newItem: mockFilledItem,
    onUpdateItem: (updates) => console.log('Update item:', updates),
    onSave: () => console.log('Save item'),
    onCancel: () => console.log('Cancel'),
  },
}

export const UnavailableItem: Story = {
  args: {
    newItem: { ...mockFilledItem, isAvailable: false },
    onUpdateItem: (updates) => console.log('Update item:', updates),
    onSave: () => console.log('Save item'),
    onCancel: () => console.log('Cancel'),
  },
}

export const ExpensiveItem: Story = {
  args: {
    newItem: {
      ...mockNewItem,
      name: 'Wagyu Beef',
      description: 'Premium Japanese A5 wagyu beef',
      price: 89.99,
      isAvailable: true,
      restaurantMenuId: '1',
      categoryId: '1'
    },
    onUpdateItem: (updates) => console.log('Update item:', updates),
    onSave: () => console.log('Save item'),
    onCancel: () => console.log('Cancel'),
  },
}

export const InteractionDemo = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">Add New Item Form</h3>
        <p className="text-sm text-gray-600 mb-4">
          This form allows users to create new menu items directly in the table. Fill in the fields and click save.
        </p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Available</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AddNewItemForm
              newItem={mockNewItem}
              onUpdateItem={(updates) => console.log('Demo update item:', updates)}
              onSave={() => {
                console.log('Demo save')
                alert('New item saved!')
              }}
              onCancel={() => {
                console.log('Demo cancel')
                alert('Cancelled!')
              }}
            />
          </TableBody>
        </Table>
      </div>
    </div>
  )
}