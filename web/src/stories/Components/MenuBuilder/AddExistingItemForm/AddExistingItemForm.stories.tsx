import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { AddExistingItemForm } from './AddExistingItemForm'
import { Table, TableHeader, TableBody, TableRow, TableHead } from '@/components/ui/table'

const mockAvailableItems = [
  {
    id: '1',
    name: 'Grilled Salmon',
    description: 'Fresh Atlantic salmon with lemon butter',
    price: 24.99,
    isAvailable: true,
    restaurantMenuId: '1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    menuCategoryItems: [],
    options: [],
    allergens: []
  },
  {
    id: '2',
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce with parmesan cheese',
    price: 12.50,
    isAvailable: true,
    restaurantMenuId: '1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    menuCategoryItems: [],
    options: [],
    allergens: []
  },
  {
    id: '3',
    name: 'Ribeye Steak',
    description: '12oz prime cut with seasonal vegetables',
    price: 32.99,
    isAvailable: false,
    restaurantMenuId: '1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    menuCategoryItems: [],
    options: [],
    allergens: []
  }
]

const meta: Meta<typeof AddExistingItemForm> = {
  component: AddExistingItemForm,
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
    selectedItemId: {
      control: 'select',
      options: ['', '1', '2', '3'],
      description: 'ID of the selected item',
    },
    onSelectItem: {
      action: 'item selected',
      description: 'Function called when item is selected',
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

type Story = StoryObj<typeof AddExistingItemForm>

export const NoSelection: Story = {
  args: {
    selectedItemId: '',
    availableItems: mockAvailableItems,
    onSelectItem: (itemId: string) => console.log('Select item:', itemId),
    onSave: () => console.log('Save item'),
    onCancel: () => console.log('Cancel'),
  },
}

export const ItemSelected: Story = {
  args: {
    selectedItemId: '1',
    availableItems: mockAvailableItems,
    onSelectItem: (itemId: string) => console.log('Select item:', itemId),
    onSave: () => console.log('Save item'),
    onCancel: () => console.log('Cancel'),
  },
}

export const UnavailableItemSelected: Story = {
  args: {
    selectedItemId: '3',
    availableItems: mockAvailableItems,
    onSelectItem: (itemId: string) => console.log('Select item:', itemId),
    onSave: () => console.log('Save item'),
    onCancel: () => console.log('Cancel'),
  },
}

export const NoItemsAvailable: Story = {
  args: {
    selectedItemId: '',
    availableItems: [],
    onSelectItem: (itemId: string) => console.log('Select item:', itemId),
    onSave: () => console.log('Save item'),
    onCancel: () => console.log('Cancel'),
  },
}

export const InteractionDemo = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">Add Existing Item Form</h3>
        <p className="text-sm text-gray-600 mb-4">
          This form allows users to add existing menu items to a category. Select an item from the dropdown and click save.
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
            <AddExistingItemForm
              selectedItemId="1"
              availableItems={mockAvailableItems}
              onSelectItem={(itemId) => console.log('Demo select item:', itemId)}
              onSave={() => {
                console.log('Demo save')
                alert('Item saved!')
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