import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { AddItemPopover } from './AddItemPopover'

const mockItems = [
  {
    id: '1',
    name: 'Grilled Salmon',
    description: 'Fresh Atlantic salmon',
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
    description: 'Crisp romaine lettuce',
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
    description: '12oz prime cut',
    price: 32.99,
    isAvailable: true,
    restaurantMenuId: '1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    menuCategoryItems: [],
    options: [],
    allergens: []
  }
]

const meta: Meta<typeof AddItemPopover> = {
  component: AddItemPopover,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Whether the popover is open',
    },
    categoryName: {
      control: 'text',
      description: 'Name of the category',
    },
    categoryId: {
      control: 'text',
      description: 'ID of the category',
    },
    onOpenChange: {
      action: 'open changed',
      description: 'Function called when popover open state changes',
    },
    onModeSelect: {
      action: 'mode selected',
      description: 'Function called when mode is selected',
    },
  },
}

export default meta

type Story = StoryObj<typeof AddItemPopover>

export const Default: Story = {
  args: {
    categoryId: '1',
    categoryName: 'Appetizers',
    isOpen: false,
    onOpenChange: (open: boolean) => console.log('Popover open changed:', open),
    onModeSelect: (mode: 'existing' | 'new', categoryId: string) => console.log('Mode selected:', mode, categoryId),
    getAvailableExistingItems: () => mockItems,
  },
}

export const Open: Story = {
  args: {
    categoryId: '1',
    categoryName: 'Appetizers',
    isOpen: true,
    onOpenChange: (open: boolean) => console.log('Popover open changed:', open),
    onModeSelect: (mode: 'existing' | 'new', categoryId: string) => console.log('Mode selected:', mode, categoryId),
    getAvailableExistingItems: () => mockItems,
  },
}

export const NoAvailableItems: Story = {
  args: {
    categoryId: '1',
    categoryName: 'Appetizers',
    isOpen: true,
    onOpenChange: (open: boolean) => console.log('Popover open changed:', open),
    onModeSelect: (mode: 'existing' | 'new', categoryId: string) => console.log('Mode selected:', mode, categoryId),
    getAvailableExistingItems: () => [],
  },
}

export const ManyAvailableItems: Story = {
  args: {
    categoryId: '1',
    categoryName: 'Main Courses',
    isOpen: true,
    onOpenChange: (open: boolean) => console.log('Popover open changed:', open),
    onModeSelect: (mode: 'existing' | 'new', categoryId: string) => console.log('Mode selected:', mode, categoryId),
    getAvailableExistingItems: () => Array.from({ length: 15 }, (_, i) => ({ ...mockItems[0], id: `${i + 1}`, name: `Item ${i + 1}` })),
  },
}

export const LongCategoryName: Story = {
  args: {
    categoryId: '1',
    categoryName: 'Premium Seasonal Specialties and Chef Recommendations',
    isOpen: true,
    onOpenChange: (open: boolean) => console.log('Popover open changed:', open),
    onModeSelect: (mode: 'existing' | 'new', categoryId: string) => console.log('Mode selected:', mode, categoryId),
    getAvailableExistingItems: () => mockItems,
  },
}

export const InteractionDemo = () => {
  return (
    <div className="space-y-6 p-4">
      <div className="text-center space-y-4">
        <h3 className="text-lg font-semibold">Add Item Popover</h3>
        <p className="text-gray-600">
          This popover allows users to choose between adding existing menu items or creating new ones for a category.
        </p>

        <div className="flex gap-4 justify-center">
          <AddItemPopover
            categoryId="demo-1"
            categoryName="Demo Category"
            isOpen={false}
            onOpenChange={(open) => console.log('Demo popover open changed:', open)}
            onModeSelect={(mode, categoryId) => {
              console.log('Demo mode selected:', mode, categoryId)
              alert(`Selected ${mode} mode for category ${categoryId}`)
            }}
            getAvailableExistingItems={() => mockItems}
          />
        </div>

        <p className="text-sm text-gray-500">
          Click the + button to open the popover and try the different options.
        </p>
      </div>
    </div>
  )
}