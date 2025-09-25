import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SortableCategory } from './SortableCategory'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

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
    allergens: []
  },
  {
    id: '2',
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce with parmesan',
    price: 12.50,
    isAvailable: true,
    restaurantMenuId: '1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    menuCategoryItems: [],
    options: [],
    allergens: []
  }
]

const mockCategory = {
  id: '1',
  name: 'Main Courses',
  description: 'Hearty entrees and signature dishes',
  orderIndex: 1,
  restaurantMenuId: '1',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  menuCategoryItems: [
    {
      id: '1',
      menuCategoryId: '1',
      menuItemId: '1',
      orderIndex: 1,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      menuItem: mockMenuItems[0]
    },
    {
      id: '2',
      menuCategoryId: '1',
      menuItemId: '2',
      orderIndex: 2,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      menuItem: mockMenuItems[1]
    }
  ]
}

const mockNewItem = {
  name: '',
  description: '',
  price: 0,
  isAvailable: true,
  restaurantMenuId: '1',
  categoryId: '1'
}

const meta: Meta<typeof SortableCategory> = {
  component: SortableCategory,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <DndContext collisionDetection={closestCenter}>
        <SortableContext items={['1']} strategy={verticalListSortingStrategy}>
          <div className="max-w-4xl">
            <Story />
          </div>
        </SortableContext>
      </DndContext>
    ),
  ],
  argTypes: {
    editingCategory: {
      control: 'text',
      description: 'ID of category being edited',
    },
    editingItem: {
      control: 'text',
      description: 'ID of item being edited',
    },
    showNewItemForm: {
      control: 'text',
      description: 'ID of category showing new item form',
    },
    addItemMode: {
      control: 'select',
      options: [null, 'existing', 'new'],
      description: 'Current add item mode',
    },
    onEditCategory: {
      action: 'edit category',
    },
    onDeleteCategory: {
      action: 'delete category',
    },
    onModeSelect: {
      action: 'mode selected',
    },
    onEditItem: {
      action: 'edit item',
    },
    onDeleteItem: {
      action: 'delete item',
    },
  },
}

export default meta

type Story = StoryObj<typeof SortableCategory>

export const Default: Story = {
  args: {
    category: mockCategory,
    editingCategory: null,
    editingItem: null,
    showNewItemForm: null,
    addItemMode: null,
    selectedExistingItem: '',
    newItem: mockNewItem,
    popoverOpen: null,
    onEditCategory: () => console.log('Edit category'),
    onDeleteCategory: () => console.log('Delete category'),
    onModeSelect: (mode, categoryId) => console.log('Mode select:', mode, categoryId),
    onEditItem: (itemId) => console.log('Edit item:', itemId),
    onDeleteItem: (categoryItemId) => console.log('Delete item:', categoryItemId),
    onUpdateCategory: (categoryId, updates) => console.log('Update category:', categoryId, updates),
    onUpdateMenuItem: (categoryId, itemId, updates) => console.log('Update item:', categoryId, itemId, updates),
    onSetSelectedExistingItem: (itemId: string) => console.log('Select existing:', itemId),
    onSetNewItem: (item: any) => console.log('Update new item:', item),
    onAddMenuItem: () => console.log('Save new item'),
    onAddExistingMenuItem: () => console.log('Save existing item'),
    onCloseAddItemForm: () => console.log('Cancel add item'),
    getAvailableExistingItems: () => mockMenuItems,
    onSetPopoverOpen: (categoryId) => console.log('Set popover open:', categoryId),
  },
}

export const EditingCategory: Story = {
  args: {
    ...Default.args,
    editingCategory: '1',
  },
}

export const EditingItem: Story = {
  args: {
    ...Default.args,
    editingItem: '1',
  },
}

export const ShowingNewItemForm: Story = {
  args: {
    ...Default.args,
    showNewItemForm: '1',
    addItemMode: 'new',
  },
}

export const ShowingExistingItemForm: Story = {
  args: {
    ...Default.args,
    showNewItemForm: '1',
    addItemMode: 'existing',
    selectedExistingItem: '1',
  },
}

export const EmptyCategory: Story = {
  args: {
    ...Default.args,
    category: {
      ...mockCategory,
      menuCategoryItems: []
    },
  },
}

export const PopoverOpen: Story = {
  args: {
    ...Default.args,
    popoverOpen: '1',
  },
}

export const InteractionDemo = () => {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">Sortable Category</h3>
        <p className="text-sm text-gray-600 mb-4">
          A draggable menu category with items, inline editing, and item management capabilities.
        </p>
      </div>
      <DndContext collisionDetection={closestCenter}>
        <SortableContext items={['demo-1']} strategy={verticalListSortingStrategy}>
          <SortableCategory
            category={{ ...mockCategory, id: 'demo-1' }}
            editingCategory={null}
            editingItem={null}
            showNewItemForm={null}
            addItemMode={null}
            selectedExistingItem=""
            newItem={mockNewItem}
            popoverOpen={null}
            onEditCategory={() => alert('Edit category!')}
            onDeleteCategory={() => alert('Delete category?')}
            onModeSelect={(mode, categoryId) => alert(`Selected ${mode} mode for ${categoryId}`)}
            onEditItem={(itemId) => alert(`Edit item ${itemId}`)}
            onDeleteItem={(categoryItemId) => alert(`Delete item ${categoryItemId}?`)}
            onUpdateCategory={(categoryId, updates) => console.log('Demo update category:', categoryId, updates)}
            onUpdateMenuItem={(categoryId, itemId, updates) => console.log('Demo update item:', categoryId, itemId, updates)}
            onSetSelectedExistingItem={(itemId: string) => console.log('Demo select existing:', itemId)}
            onSetNewItem={(item: any) => console.log('Demo update new item:', item)}
            onAddMenuItem={() => alert('Save new item!')}
            onAddExistingMenuItem={() => alert('Save existing item!')}
            onCloseAddItemForm={() => alert('Cancel add item')}
            getAvailableExistingItems={() => mockMenuItems}
            onSetPopoverOpen={(categoryId) => console.log('Demo set popover open:', categoryId)}
          />
        </SortableContext>
      </DndContext>
    </div>
  )
}