import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SortableMenuItem } from './SortableMenuItem'
import { Table, TableHeader, TableBody, TableRow, TableHead } from '@/components/ui/table'
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

const mockCategoryItem = {
  id: '1',
  menuCategoryId: '1',
  menuItemId: '1',
  orderIndex: 1,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  menuItem: {
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
  }
}

const mockItem = mockCategoryItem.menuItem

const mockCategory = {
  id: '1',
  name: 'Main Courses',
  description: 'Hearty entrees',
  orderIndex: 1,
  restaurantMenuId: '1',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  menuCategoryItems: [mockCategoryItem]
}

const meta: Meta<typeof SortableMenuItem> = {
  component: SortableMenuItem,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story, { args }) => (
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={(event: DragEndEvent) => console.log('Drag ended:', event)}
      >
        <SortableContext items={[args.categoryItem?.id || '1']} strategy={verticalListSortingStrategy}>
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
        </SortableContext>
      </DndContext>
    ),
  ],
  argTypes: {
    editingItem: {
      control: 'text',
      description: 'ID of the item currently being edited',
    },
    onUpdateMenuItem: {
      action: 'update menu item',
      description: 'Function called when item is updated',
    },
    onEditItem: {
      action: 'edit item',
      description: 'Function called when edit is clicked',
    },
    onDeleteItem: {
      action: 'delete item',
      description: 'Function called when delete is clicked',
    },
  },
}

export default meta

type Story = StoryObj<typeof SortableMenuItem>

export const Default: Story = {
  args: {
    categoryItem: mockCategoryItem,
    item: mockItem,
    category: mockCategory,
    editingItem: null,
    onUpdateMenuItem: (categoryId: string, itemId: string, updates: any) =>
      console.log('Update item:', { categoryId, itemId, updates }),
    onEditItem: (itemId: string) => console.log('Edit item:', itemId),
    onDeleteItem: (categoryItemId: string) => console.log('Delete item:', categoryItemId),
  },
}

export const EditingMode: Story = {
  args: {
    categoryItem: mockCategoryItem,
    item: mockItem,
    category: mockCategory,
    editingItem: '1',
    onUpdateMenuItem: (categoryId: string, itemId: string, updates: any) =>
      console.log('Update item:', { categoryId, itemId, updates }),
    onEditItem: (itemId: string) => console.log('Edit item:', itemId),
    onDeleteItem: (categoryItemId: string) => console.log('Delete item:', categoryItemId),
  },
}

export const UnavailableItem: Story = {
  args: {
    categoryItem: {
      ...mockCategoryItem,
      menuItem: {
        ...mockItem,
        isAvailable: false,
        name: 'Seasonal Special',
        description: 'Currently out of season'
      }
    },
    item: {
      ...mockItem,
      isAvailable: false,
      name: 'Seasonal Special',
      description: 'Currently out of season'
    },
    category: mockCategory,
    editingItem: null,
    onUpdateMenuItem: (categoryId: string, itemId: string, updates: any) =>
      console.log('Update item:', { categoryId, itemId, updates }),
    onEditItem: (itemId: string) => console.log('Edit item:', itemId),
    onDeleteItem: (categoryItemId: string) => console.log('Delete item:', categoryItemId),
  },
}

export const ExpensiveItem: Story = {
  args: {
    categoryItem: {
      ...mockCategoryItem,
      menuItem: {
        ...mockItem,
        name: 'Wagyu Beef Steak',
        description: 'Premium Japanese A5 wagyu beef with truffle butter',
        price: 149.99
      }
    },
    item: {
      ...mockItem,
      name: 'Wagyu Beef Steak',
      description: 'Premium Japanese A5 wagyu beef with truffle butter',
      price: 149.99
    },
    category: mockCategory,
    editingItem: null,
    onUpdateMenuItem: (categoryId: string, itemId: string, updates: any) =>
      console.log('Update item:', { categoryId, itemId, updates }),
    onEditItem: (itemId: string) => console.log('Edit item:', itemId),
    onDeleteItem: (categoryItemId: string) => console.log('Delete item:', categoryItemId),
  },
}

export const InteractionDemo = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">Sortable Menu Item</h3>
        <p className="text-sm text-gray-600 mb-4">
          A draggable menu item row with inline editing capabilities. Drag the grip handle to reorder, click edit to modify, or delete to remove.
        </p>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={(event) => console.log('Demo drag ended:', event)}
        >
          <SortableContext items={['demo-1']} strategy={verticalListSortingStrategy}>
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
                <SortableMenuItem
                  categoryItem={{ ...mockCategoryItem, id: 'demo-1' }}
                  item={mockItem}
                  category={mockCategory}
                  editingItem={null}
                  onUpdateMenuItem={(categoryId, itemId, updates) => {
                    console.log('Demo update:', { categoryId, itemId, updates })
                    alert(`Updated item ${itemId}!`)
                  }}
                  onEditItem={(itemId) => {
                    console.log('Demo edit:', itemId)
                    alert(`Edit mode for item ${itemId}`)
                  }}
                  onDeleteItem={(categoryItemId) => {
                    console.log('Demo delete:', categoryItemId)
                    alert(`Delete item ${categoryItemId}?`)
                  }}
                />
              </TableBody>
            </Table>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  )
}