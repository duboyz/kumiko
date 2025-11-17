import type { Meta, StoryObj } from '@storybook/react'
import { MenuBuilder } from './MenuBuilder'
import { RestaurantMenuDto } from '@shared'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
    },
  },
})

// Mock menu data
const mockMenuWithItems: RestaurantMenuDto = {
  id: 'menu-1',
  name: 'Main Menu',
  description: 'Our carefully crafted selection of dishes',
  restaurantId: 'restaurant-1',
  categories: [
    {
      id: 'category-1',
      name: 'Appetizers',
      description: 'Start your meal right',
      orderIndex: 0,
      restaurantMenuId: 'menu-1',
      menuCategoryItems: [
        {
          id: 'item-1',
          menuCategoryId: 'category-1',
          menuItemId: 'menu-item-1',
          orderIndex: 0,
          menuItem: {
            id: 'menu-item-1',
            name: 'Spring Rolls',
            description: 'Crispy vegetable spring rolls with sweet chili sauce',
            price: 89,
            hasOptions: false,
            isAvailable: true,
            restaurantMenuId: 'menu-1',
            menuCategoryItems: [],
            options: [],
            allergens: [],
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'item-2',
          menuCategoryId: 'category-1',
          menuItemId: 'menu-item-2',
          orderIndex: 1,
          menuItem: {
            id: 'menu-item-2',
            name: 'Bruschetta',
            description: 'Toasted bread with fresh tomatoes, basil, and mozzarella',
            price: 95,
            hasOptions: false,
            isAvailable: true,
            restaurantMenuId: 'menu-1',
            menuCategoryItems: [],
            options: [],
            allergens: [],
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 'category-2',
      name: 'Main Courses',
      description: 'Hearty main dishes',
      orderIndex: 1,
      restaurantMenuId: 'menu-1',
      menuCategoryItems: [
        {
          id: 'item-3',
          menuCategoryId: 'category-2',
          menuItemId: 'menu-item-3',
          orderIndex: 0,
          menuItem: {
            id: 'menu-item-3',
            name: 'Margherita Pizza',
            description: 'Classic tomato sauce, mozzarella, and fresh basil',
            price: 149,
            hasOptions: true,
            isAvailable: true,
            restaurantMenuId: 'menu-1',
            menuCategoryItems: [],
            options: [
              {
                id: 'option-1',
                name: 'Small',
                description: '8 inch',
                price: 149,
                orderIndex: 0,
                menuItemId: 'menu-item-3',
              },
              {
                id: 'option-2',
                name: 'Medium',
                description: '12 inch',
                price: 199,
                orderIndex: 1,
                menuItemId: 'menu-item-3',
              },
              {
                id: 'option-3',
                name: 'Large',
                description: '16 inch',
                price: 249,
                orderIndex: 2,
                menuItemId: 'menu-item-3',
              },
            ],
            allergens: [
              {
                id: 'allergen-1',
                name: 'Gluten',
                description: 'Contains gluten',
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z',
              },
            ],
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'item-4',
          menuCategoryId: 'category-2',
          menuItemId: 'menu-item-4',
          orderIndex: 1,
          menuItem: {
            id: 'menu-item-4',
            name: 'Grilled Salmon',
            description: 'Fresh Atlantic salmon with lemon butter sauce and seasonal vegetables',
            price: 249,
            hasOptions: false,
            isAvailable: true,
            restaurantMenuId: 'menu-1',
            menuCategoryItems: [],
            options: [],
            allergens: [
              {
                id: 'allergen-2',
                name: 'Fish',
                description: 'Contains fish',
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z',
              },
            ],
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 'category-3',
      name: 'Desserts',
      description: 'Sweet endings',
      orderIndex: 2,
      restaurantMenuId: 'menu-1',
      menuCategoryItems: [
        {
          id: 'item-5',
          menuCategoryId: 'category-3',
          menuItemId: 'menu-item-5',
          orderIndex: 0,
          menuItem: {
            id: 'menu-item-5',
            name: 'Chocolate Lava Cake',
            description: 'Warm chocolate cake with a molten center, served with vanilla ice cream',
            price: 129,
            hasOptions: false,
            isAvailable: true,
            restaurantMenuId: 'menu-1',
            menuCategoryItems: [],
            options: [],
            allergens: [
              {
                id: 'allergen-3',
                name: 'Eggs',
                description: 'Contains eggs',
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z',
              },
              {
                id: 'allergen-4',
                name: 'Milk',
                description: 'Contains milk',
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z',
              },
            ],
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  ],
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

const mockEmptyMenu: RestaurantMenuDto = {
  id: 'menu-2',
  name: 'New Menu',
  description: 'Start building your menu',
  restaurantId: 'restaurant-1',
  categories: [],
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

const meta = {
  title: 'Menus/MenuBuilder',
  component: MenuBuilder,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Menu Builder

A comprehensive menu builder component for creating and managing restaurant menus with categories and items.

## Features

- **Category Management**: Create, edit, delete, and reorder categories
- **Item Management**: Add, edit, delete, and reorder menu items within categories
- **Drag & Drop**: Reorder categories and items by dragging
- **Item Options**: Support for menu items with multiple size/option variants
- **Allergen Management**: Add and manage allergens for menu items
- **Responsive Design**: Mobile-friendly with sidebar sheet on small screens
- **Real-time Updates**: Changes are saved automatically with visual feedback

## Usage

The MenuBuilder component is used in:
- \`/menus/[id]\` - Full page menu editor
- Onboarding flow - Manual menu creation step

## Note

This story requires a running backend API to function properly. The component uses React Query hooks for data fetching and mutations.

For demonstration purposes, please use the actual application at:
- \`/menus/{menuId}\` - Full menu editor page
- Onboarding flow - Menu creation step
        `,
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    Story => {
      const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
      return (
        <QueryClientProvider client={queryClient}>
          <div className="h-screen flex flex-col">
            <div className="border-b bg-background p-4 flex items-center gap-4">
              <div className="flex-1">
                <h1 className="text-lg font-bold">Menu Builder Story</h1>
                {hasUnsavedChanges && <p className="text-sm text-amber-600">Unsaved changes</p>}
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <Story
                args={{
                  onUnsavedChangesChange: setHasUnsavedChanges,
                }}
              />
            </div>
          </div>
        </QueryClientProvider>
      )
    },
  ],
  argTypes: {
    menu: {
      description: 'The restaurant menu data to display and edit',
    },
    onUnsavedChangesChange: {
      action: 'unsaved-changes',
      description: 'Callback when unsaved changes state changes',
    },
    onSaveAllHandlerReady: {
      action: 'save-all-ready',
      description: 'Callback when save all handler is ready',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof MenuBuilder>

export default meta
type Story = StoryObj<typeof meta>

export const WithItems: Story = {
  args: {
    menu: mockMenuWithItems,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Menu builder with multiple categories and items. Includes items with options, allergens, and various states.',
      },
    },
  },
}

export const EmptyMenu: Story = {
  args: {
    menu: mockEmptyMenu,
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty menu with no categories. Users can start by creating their first category.',
      },
    },
  },
}

export const SingleCategory: Story = {
  args: {
    menu: {
      ...mockMenuWithItems,
      categories: [mockMenuWithItems.categories[0]],
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Menu with a single category containing multiple items.',
      },
    },
  },
}
