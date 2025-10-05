import type { Meta, StoryObj } from '@storybook/react'
import { MenuDisplay } from './MenuDisplay'
import { GetMenuByIdResult } from '@shared'

const meta: Meta<typeof MenuDisplay> = {
  title: 'Orders/MenuDisplay',
  component: MenuDisplay,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    onAddToCart: { action: 'add to cart' },
  },
}

export default meta
type Story = StoryObj<typeof MenuDisplay>

// Mock menu data for stories
const mockMenu: GetMenuByIdResult = {
  id: 'menu-1',
  name: 'Delicious Restaurant Menu',
  description: 'Fresh ingredients, amazing flavors',
  restaurantId: 'restaurant-1',
  categories: [
    {
      id: 'cat-1',
      name: 'Appetizers',
      description: 'Start your meal with these delicious appetizers',
      orderIndex: 1,
      menuCategoryItems: [
        {
          id: 'item-1',
          orderIndex: 1,
          menuItem: {
            id: 'menu-item-1',
            name: 'Caesar Salad',
            description: 'Fresh romaine lettuce with parmesan cheese and croutons',
            price: 8.99,
            isAvailable: true,
            hasOptions: false,
            options: [],
            allergens: [
              { id: 'allergen-1', name: 'Dairy', description: 'Contains dairy products', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
              { id: 'allergen-2', name: 'Gluten', description: 'Contains gluten', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            ],
          },
        },
        {
          id: 'item-2',
          orderIndex: 2,
          menuItem: {
            id: 'menu-item-2',
            name: 'Chicken Wings',
            description: 'Crispy chicken wings with your choice of sauce',
            price: 0,
            isAvailable: true,
            hasOptions: true,
            options: [
              {
                id: 'opt-1',
                name: 'Buffalo',
                description: 'Spicy buffalo sauce',
                price: 9.99,
                orderIndex: 1,
              },
              {
                id: 'opt-2',
                name: 'BBQ',
                description: 'Sweet and tangy BBQ sauce',
                price: 9.99,
                orderIndex: 2,
              },
            ],
            allergens: [],
          },
        },
      ],
    },
    {
      id: 'cat-2',
      name: 'Main Courses',
      description: 'Our signature dishes',
      orderIndex: 2,
      menuCategoryItems: [
        {
          id: 'item-3',
          orderIndex: 1,
          menuItem: {
            id: 'menu-item-3',
            name: 'Margherita Pizza',
            description: 'Classic tomato and mozzarella pizza with fresh basil',
            price: 12.99,
            isAvailable: true,
            hasOptions: false,
            options: [],
            allergens: [
              { id: 'allergen-3', name: 'Dairy', description: 'Contains dairy products', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
              { id: 'allergen-4', name: 'Gluten', description: 'Contains gluten', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            ],
          },
        },
        {
          id: 'item-4',
          orderIndex: 2,
          menuItem: {
            id: 'menu-item-4',
            name: 'Grilled Salmon',
            description: 'Fresh Atlantic salmon with herbs and lemon',
            price: 18.99,
            isAvailable: false,
            hasOptions: false,
            options: [],
            allergens: [
              { id: 'allergen-5', name: 'Fish', description: 'Contains fish', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            ],
          },
        },
      ],
    },
  ],
}

export const Default: Story = {
  args: {
    menu: mockMenu,
    onAddToCart: (menuItemId, menuItemName, price, menuItemOptionId, menuItemOptionName) =>
      console.log('Add to cart:', { menuItemId, menuItemName, price, menuItemOptionId, menuItemOptionName }),
  },
}
