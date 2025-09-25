import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { MenuEditor } from './MenuEditor'
import { RestaurantMenuDto, MenuCategoryDto, MenuItemDto } from '../../../../shared/types/menu.types'
import '../../../styles/globals.css'

// Mock data for stories
const mockMenuItems: MenuItemDto[] = [
  {
    id: 'item-1',
    name: 'Bruschetta',
    description: 'Toasted bread with fresh tomatoes, garlic, and basil',
    price: 12.5,
    isAvailable: true,
    restaurantMenuId: 'menu-1',
    menuCategoryItems: [],
    options: [],
    allergens: [],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'item-2',
    name: 'Calamari Rings',
    description: 'Crispy fried squid rings with marinara sauce',
    price: 15.0,
    isAvailable: true,
    restaurantMenuId: 'menu-1',
    menuCategoryItems: [],
    options: [],
    allergens: [],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'item-3',
    name: 'Grilled Salmon',
    description: 'Fresh Atlantic salmon with lemon butter sauce',
    price: 28.0,
    isAvailable: true,
    restaurantMenuId: 'menu-1',
    menuCategoryItems: [],
    options: [],
    allergens: [],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'item-4',
    name: 'Ribeye Steak',
    description: '12oz ribeye steak cooked to perfection',
    price: 35.0,
    isAvailable: false,
    restaurantMenuId: 'menu-1',
    menuCategoryItems: [],
    options: [],
    allergens: [],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
]

const mockCategories: MenuCategoryDto[] = [
  {
    id: '1',
    name: 'Appetizers',
    description: 'Start your meal with our delicious appetizers',
    orderIndex: 0,
    restaurantMenuId: 'menu-1',
    menuCategoryItems: [
      {
        id: 'cat-item-1',
        menuCategoryId: '1',
        menuItemId: 'item-1',
        orderIndex: 0,
        menuItem: mockMenuItems[0],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
      {
        id: 'cat-item-2',
        menuCategoryId: '1',
        menuItemId: 'item-2',
        orderIndex: 1,
        menuItem: mockMenuItems[1],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
    ],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'Main Courses',
    description: 'Our signature main dishes',
    orderIndex: 1,
    restaurantMenuId: 'menu-1',
    menuCategoryItems: [
      {
        id: 'cat-item-3',
        menuCategoryId: '2',
        menuItemId: 'item-3',
        orderIndex: 0,
        menuItem: mockMenuItems[2],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
      {
        id: 'cat-item-4',
        menuCategoryId: '2',
        menuItemId: 'item-4',
        orderIndex: 1,
        menuItem: mockMenuItems[3],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
    ],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
]

const mockMenu: RestaurantMenuDto = {
  id: 'menu-1',
  name: 'Main Menu',
  description: 'Our carefully crafted selection of dishes',
  restaurantId: 'restaurant-1',
  categories: mockCategories,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
}

// Mock the hooks since they won't work in Storybook
const MockProviders = ({ children }: { children: React.ReactNode }) => {
  // Mock hook implementations would go here
  // For now, we'll just render the children
  return <div>{children}</div>
}

const meta: Meta<typeof MenuEditor> = {
  title: 'Components/MenuBuilder/MenuEditor',
  component: MenuEditor,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Production menu editor with full API integration. Provides a complete interface for editing restaurant menus with real-time updates, drag-and-drop functionality, and comprehensive menu management.',
      },
    },
  },
  decorators: [
    (Story) => (
      <MockProviders>
        <Story />
      </MockProviders>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    onBackToList: { action: 'back to list clicked' },
  },
}

export default meta
type Story = StoryObj<typeof MenuEditor>

export const Default: Story = {
  args: {
    menu: mockMenu,
    onBackToList: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: 'Default menu editor with sample menu data. Shows the complete interface for editing restaurant menus including categories and items.',
      },
    },
  },
}

export const EmptyMenu: Story = {
  args: {
    menu: {
      ...mockMenu,
      categories: [],
    },
    onBackToList: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: 'Menu editor with an empty menu, showing the empty state and add category form.',
      },
    },
  },
}

export const LargeMenu: Story = {
  args: {
    menu: {
      ...mockMenu,
      categories: [
        ...mockCategories,
        {
          id: '3',
          name: 'Desserts',
          description: 'Sweet endings to your meal',
          orderIndex: 2,
          restaurantMenuId: 'menu-1',
          menuCategoryItems: [
            {
              id: 'cat-item-5',
              menuCategoryId: '3',
              menuItemId: 'item-5',
              orderIndex: 0,
              menuItem: {
                id: 'item-5',
                name: 'Chocolate Lava Cake',
                description: 'Warm chocolate cake with molten center',
                price: 9.5,
                isAvailable: true,
                restaurantMenuId: 'menu-1',
                menuCategoryItems: [],
                options: [],
                allergens: [],
                createdAt: '2024-01-01',
                updatedAt: '2024-01-01',
              },
              createdAt: '2024-01-01',
              updatedAt: '2024-01-01',
            },
          ],
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
        {
          id: '4',
          name: 'Beverages',
          description: 'Refreshing drinks and specialty beverages',
          orderIndex: 3,
          restaurantMenuId: 'menu-1',
          menuCategoryItems: [
            {
              id: 'cat-item-6',
              menuCategoryId: '4',
              menuItemId: 'item-6',
              orderIndex: 0,
              menuItem: {
                id: 'item-6',
                name: 'House Wine',
                description: 'Our signature red wine blend',
                price: 8.0,
                isAvailable: true,
                restaurantMenuId: 'menu-1',
                menuCategoryItems: [],
                options: [],
                allergens: [],
                createdAt: '2024-01-01',
                updatedAt: '2024-01-01',
              },
              createdAt: '2024-01-01',
              updatedAt: '2024-01-01',
            },
          ],
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ],
    },
    onBackToList: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: 'Menu editor with a larger menu containing multiple categories and items, demonstrating scalability.',
      },
    },
  },
}

export const InteractiveDemo: Story = {
  args: {
    menu: mockMenu,
    onBackToList: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo of the menu editor. Try editing menu items, adding categories, and managing the menu structure.',
      },
    },
  },
}