import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import MenuItemTableView from './MenuItemTableView'

const mockMenuItems = [
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
    allergens: [],
  },
  {
    id: '2',
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce with parmesan',
    price: 12.5,
    isAvailable: true,
    restaurantMenuId: '1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    menuCategoryItems: [],
    options: [],
    allergens: [],
  },
  {
    id: '3',
    name: 'Ribeye Steak',
    description: '12oz prime cut with seasonal vegetables',
    price: 32.99,
    isAvailable: false,
    restaurantMenuId: '2',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    menuCategoryItems: [],
    options: [],
    allergens: [],
  },
  {
    id: '4',
    name: 'Chicken Parmesan',
    description: 'Breaded chicken with marinara sauce',
    price: 18.99,
    isAvailable: true,
    restaurantMenuId: '1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    menuCategoryItems: [],
    options: [],
    allergens: [],
  },
  {
    id: '5',
    name: 'Vegetable Pasta',
    description: 'Fresh pasta with seasonal vegetables',
    price: 16.5,
    isAvailable: true,
    restaurantMenuId: '2',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    menuCategoryItems: [],
    options: [],
    allergens: [],
  },
]

const mockMenus = [
  {
    id: '1',
    name: 'Dinner Menu',
    description: 'Evening dining options',
    restaurantId: '1',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    categories: [],
  },
  {
    id: '2',
    name: 'Lunch Menu',
    description: 'Midday specials',
    restaurantId: '1',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    categories: [],
  },
]

const meta: Meta<typeof MenuItemTableView> = {
  component: MenuItemTableView,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    isLoading: {
      control: 'boolean',
      description: 'Whether the table is in loading state',
    },
    onEditItem: {
      action: 'edit item',
      description: 'Function called when item is edited',
    },
    onDeleteItem: {
      action: 'delete item',
      description: 'Function called when item is deleted',
    },
    onUpdateItem: {
      action: 'update item',
      description: 'Function called when item is updated',
    },
    onCreateItem: {
      action: 'create item',
      description: 'Function called when item is created',
    },
    onBulkDelete: {
      action: 'bulk delete',
      description: 'Function called when items are bulk deleted',
    },
    onBulkUpdate: {
      action: 'bulk update',
      description: 'Function called when items are bulk updated',
    },
  },
}

export default meta

type Story = StoryObj<typeof MenuItemTableView>

export const Default: Story = {
  args: {
    menuItems: mockMenuItems,
    menus: mockMenus,
    isLoading: false,
    onEditItem: item => console.log('Edit item:', item),
    onDeleteItem: id => console.log('Delete item:', id),
    onUpdateItem: item => console.log('Update item:', item),
    onCreateItem: item => console.log('Create item:', item),
    onBulkDelete: ids => console.log('Bulk delete:', ids),
    onBulkUpdate: updates => console.log('Bulk update:', updates),
  },
}

export const Loading: Story = {
  args: {
    menuItems: [],
    menus: mockMenus,
    isLoading: true,
    onEditItem: item => console.log('Edit item:', item),
    onDeleteItem: id => console.log('Delete item:', id),
    onUpdateItem: item => console.log('Update item:', item),
    onCreateItem: item => console.log('Create item:', item),
    onBulkDelete: ids => console.log('Bulk delete:', ids),
    onBulkUpdate: updates => console.log('Bulk update:', updates),
  },
}

export const Empty: Story = {
  args: {
    menuItems: [],
    menus: mockMenus,
    isLoading: false,
    onEditItem: item => console.log('Edit item:', item),
    onDeleteItem: id => console.log('Delete item:', id),
    onUpdateItem: item => console.log('Update item:', item),
    onCreateItem: item => console.log('Create item:', item),
    onBulkDelete: ids => console.log('Bulk delete:', ids),
    onBulkUpdate: updates => console.log('Bulk update:', updates),
  },
}

export const SingleItem: Story = {
  args: {
    menuItems: [mockMenuItems[0]],
    menus: mockMenus,
    isLoading: false,
    onEditItem: item => console.log('Edit item:', item),
    onDeleteItem: id => console.log('Delete item:', id),
    onUpdateItem: item => console.log('Update item:', item),
    onCreateItem: item => console.log('Create item:', item),
    onBulkDelete: ids => console.log('Bulk delete:', ids),
    onBulkUpdate: updates => console.log('Bulk update:', updates),
  },
}

export const LargeDataset: Story = {
  args: {
    menuItems: Array.from({ length: 50 }, (_, i) => ({
      ...mockMenuItems[i % mockMenuItems.length],
      id: `item-${i + 1}`,
      name: `${mockMenuItems[i % mockMenuItems.length].name} ${i + 1}`,
    })),
    menus: mockMenus,
    isLoading: false,
    onEditItem: item => console.log('Edit item:', item),
    onDeleteItem: id => console.log('Delete item:', id),
    onUpdateItem: item => console.log('Update item:', item),
    onCreateItem: item => console.log('Create item:', item),
    onBulkDelete: ids => console.log('Bulk delete:', ids),
    onBulkUpdate: updates => console.log('Bulk update:', updates),
  },
}

export const InteractionDemo = () => {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">Menu Item Table</h3>
        <p className="text-sm text-gray-600 mb-4">
          A comprehensive table view for managing menu items with search, filtering, bulk operations, and inline
          editing.
        </p>
      </div>
      <MenuItemTableView
        menuItems={mockMenuItems}
        menus={mockMenus}
        isLoading={false}
        onEditItem={item => {
          console.log('Demo edit item:', item)
          alert(`Editing ${item.name}`)
        }}
        onDeleteItem={id => {
          console.log('Demo delete item:', id)
          alert(`Delete item ${id}?`)
        }}
        onUpdateItem={item => {
          console.log('Demo update item:', item)
          alert(`Updated ${item.name}!`)
        }}
        onCreateItem={item => {
          console.log('Demo create item:', item)
          alert(`Created new item: ${item.name}!`)
        }}
        onBulkDelete={ids => {
          console.log('Demo bulk delete:', ids)
          alert(`Bulk delete ${ids.length} items?`)
        }}
        onBulkUpdate={updates => {
          console.log('Demo bulk update:', updates)
          alert(`Bulk update ${updates.itemIds.length} items!`)
        }}
      />
    </div>
  )
}
