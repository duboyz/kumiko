import { RestaurantMenuSection } from './RestaurantMenuSection'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import type { RestaurantMenuDto, MenuCategoryDto, MenuItemDto, MenuCategoryItemDto } from '@shared/types'

// Mock data
const mockMenuItems: MenuItemDto[] = [
  {
    id: '1',
    name: 'Grilled Salmon',
    description: 'Fresh Atlantic salmon grilled to perfection, served with seasonal vegetables and lemon butter sauce',
    price: 28.5,
    isAvailable: true,
    restaurantMenuId: 'menu-1',
    menuCategoryItems: [],
    options: [],
    allergens: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Chicken Teriyaki',
    description: 'Tender chicken breast glazed with house-made teriyaki sauce, served over steamed rice',
    price: 24.0,
    isAvailable: true,
    restaurantMenuId: 'menu-1',
    menuCategoryItems: [],
    options: [],
    allergens: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Vegetable Curry',
    description: 'A medley of fresh vegetables in aromatic curry spices, served with basmati rice',
    price: 22.0,
    isAvailable: true,
    restaurantMenuId: 'menu-1',
    menuCategoryItems: [],
    options: [],
    allergens: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]

const mockAppetizers: MenuItemDto[] = [
  {
    id: '4',
    name: 'Bruschetta',
    description: 'Toasted bread topped with fresh tomatoes, basil, and mozzarella',
    price: 12.0,
    isAvailable: true,
    restaurantMenuId: 'menu-1',
    menuCategoryItems: [],
    options: [],
    allergens: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '5',
    name: 'Calamari Rings',
    description: 'Crispy fried squid rings served with marinara sauce',
    price: 14.5,
    isAvailable: true,
    restaurantMenuId: 'menu-1',
    menuCategoryItems: [],
    options: [],
    allergens: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]

const createMockCategoryItems = (items: MenuItemDto[], categoryId: string): MenuCategoryItemDto[] => {
  return items.map((item, index) => ({
    id: `cat-item-${item.id}`,
    menuCategoryId: categoryId,
    menuItemId: item.id,
    orderIndex: index,
    menuItem: item,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  }))
}

const mockCategories: MenuCategoryDto[] = [
  {
    id: 'cat-1',
    name: 'Appetizers',
    description: 'Start your meal with our delicious appetizers',
    orderIndex: 0,
    restaurantMenuId: 'menu-1',
    menuCategoryItems: createMockCategoryItems(mockAppetizers, 'cat-1'),
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-2',
    name: 'Main Courses',
    description: 'Our signature main dishes prepared with fresh ingredients',
    orderIndex: 1,
    restaurantMenuId: 'menu-1',
    menuCategoryItems: createMockCategoryItems(mockMenuItems, 'cat-2'),
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]

const mockMenu: RestaurantMenuDto = {
  id: 'menu-1',
  name: 'Dinner Menu',
  description: 'Our evening dinner selection featuring fresh seasonal ingredients',
  restaurantId: 'restaurant-1',
  categories: mockCategories,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

const mockLunchMenu: RestaurantMenuDto = {
  id: 'menu-2',
  name: 'Lunch Menu',
  description: 'Light and fresh lunch options perfect for midday dining',
  restaurantId: 'restaurant-1',
  categories: [
    {
      id: 'cat-3',
      name: 'Salads',
      description: 'Fresh and healthy salad options',
      orderIndex: 0,
      restaurantMenuId: 'menu-2',
      menuCategoryItems: [],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  ],
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

const meta = {
  title: 'Menus/RestaurantMenuSection',
  component: RestaurantMenuSection,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    restaurantMenu: mockMenu,
    allowOrdering: true,
  },
} satisfies Meta<typeof RestaurantMenuSection>

export default meta

export const DinnerMenu: StoryObj<typeof meta> = {
  args: {
    restaurantMenu: mockMenu,
    allowOrdering: true,
  },
}

export const MenuWithoutOrdering: StoryObj<typeof meta> = {
  args: {
    restaurantMenu: mockMenu,
    allowOrdering: false,
  },
}

export const LunchMenu: StoryObj<typeof meta> = {
  args: {
    restaurantMenu: mockLunchMenu,
    allowOrdering: true,
  },
}

export const EditableMode: StoryObj<typeof meta> = {
  args: {
    restaurantMenu: mockMenu,
    allowOrdering: true,
    isEditing: true,
    availableMenus: [mockMenu, mockLunchMenu],
    currentMenuId: mockMenu.id,
    onUpdate: (field: string, value: string | boolean) => {
      console.log(`Field "${field}" updated to:`, value)
    },
  },
}
