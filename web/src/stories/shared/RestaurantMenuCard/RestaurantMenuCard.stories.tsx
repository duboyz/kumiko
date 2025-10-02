import { StoryObj } from '@storybook/nextjs-vite'
import { RestaurantMenuCard } from './RestaurantMenuCard'
import { RestaurantMenuDto } from '@shared/types/menu.types'

const mockMenu: RestaurantMenuDto = {
  id: '1',
  name: 'Lunch Menu',
  description: 'Our delicious lunch offerings available from 11 AM to 3 PM',
  restaurantId: 'rest-1',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  categories: [
    {
      id: '1',
      name: 'Appetizers',
      description: 'Start your meal right',
      orderIndex: 0,
      restaurantMenuId: '1',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      menuCategoryItems: [
        {
          id: '1',
          menuCategoryId: '1',
          menuItemId: 'item-1',
          orderIndex: 0,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          menuItem: {
            id: 'item-1',
            name: 'Spring Rolls',
            description: 'Fresh vegetables',
            price: 5.99,
            isAvailable: true,
            restaurantMenuId: '1',
            menuCategoryItems: [],
            options: [],
            allergens: [],
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        },
        {
          id: '2',
          menuCategoryId: '1',
          menuItemId: 'item-2',
          orderIndex: 1,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          menuItem: {
            id: 'item-2',
            name: 'Soup of the Day',
            description: 'Ask your server',
            price: 4.99,
            isAvailable: true,
            restaurantMenuId: '1',
            menuCategoryItems: [],
            options: [],
            allergens: [],
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        },
      ],
    },
    {
      id: '2',
      name: 'Main Courses',
      description: 'Our signature dishes',
      orderIndex: 1,
      restaurantMenuId: '1',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      menuCategoryItems: [
        {
          id: '3',
          menuCategoryId: '2',
          menuItemId: 'item-3',
          orderIndex: 0,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          menuItem: {
            id: 'item-3',
            name: 'Grilled Salmon',
            description: 'With seasonal vegetables',
            price: 18.99,
            isAvailable: true,
            restaurantMenuId: '1',
            menuCategoryItems: [],
            options: [],
            allergens: [],
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        },
        {
          id: '4',
          menuCategoryId: '2',
          menuItemId: 'item-4',
          orderIndex: 1,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          menuItem: {
            id: 'item-4',
            name: 'Chicken Parmesan',
            description: 'Classic Italian',
            price: 16.99,
            isAvailable: true,
            restaurantMenuId: '1',
            menuCategoryItems: [],
            options: [],
            allergens: [],
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        },
        {
          id: '5',
          menuCategoryId: '2',
          menuItemId: 'item-5',
          orderIndex: 2,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          menuItem: {
            id: 'item-5',
            name: 'Vegetable Stir Fry',
            description: 'Fresh and healthy',
            price: 14.99,
            isAvailable: true,
            restaurantMenuId: '1',
            menuCategoryItems: [],
            options: [],
            allergens: [],
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        },
      ],
    },
  ],
}

const meta = {
  component: RestaurantMenuCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    menu: mockMenu,
  },
}

export const EmptyMenu: Story = {
  args: {
    menu: {
      id: '2',
      name: 'New Menu',
      description: 'Just getting started',
      restaurantId: 'rest-1',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      categories: [],
    },
  },
}

export const NoDescription: Story = {
  args: {
    menu: {
      id: '3',
      name: 'Dinner Menu',
      description: '',
      restaurantId: 'rest-1',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      categories: [
        {
          id: '1',
          name: 'Entrees',
          description: '',
          orderIndex: 0,
          restaurantMenuId: '3',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          menuCategoryItems: [],
        },
      ],
    },
  },
}

export const LongDescription: Story = {
  args: {
    menu: {
      id: '4',
      name: 'Weekend Brunch Special',
      description:
        'Experience our amazing weekend brunch with fresh pastries, artisanal coffee, farm-to-table eggs, and much more. Available Saturday and Sunday from 9 AM to 2 PM.',
      restaurantId: 'rest-1',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      categories: [],
    },
  },
}
