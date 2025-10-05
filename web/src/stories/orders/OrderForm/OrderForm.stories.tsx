import type { Meta, StoryObj } from '@storybook/react'
import { OrderForm } from './OrderForm'
import { GetMenuByIdResult } from '@shared'

const meta: Meta<typeof OrderForm> = {
  title: 'Orders/OrderForm',
  component: OrderForm,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof OrderForm>

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
              {
                id: 'opt-3',
                name: 'Honey Garlic',
                description: 'Sweet honey garlic glaze',
                price: 10.99,
                orderIndex: 3,
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
        {
          id: 'item-5',
          orderIndex: 3,
          menuItem: {
            id: 'menu-item-5',
            name: 'Beef Burger',
            description: 'Juicy beef patty with lettuce, tomato, and onion',
            price: 0,
            isAvailable: true,
            hasOptions: true,
            options: [
              {
                id: 'opt-4',
                name: 'Regular',
                description: 'Single patty',
                price: 10.99,
                orderIndex: 1,
              },
              {
                id: 'opt-5',
                name: 'Double',
                description: 'Double patty',
                price: 13.99,
                orderIndex: 2,
              },
              {
                id: 'opt-6',
                name: 'Deluxe',
                description: 'Triple patty with extra cheese',
                price: 16.99,
                orderIndex: 3,
              },
            ],
            allergens: [],
          },
        },
      ],
    },
    {
      id: 'cat-3',
      name: 'Desserts',
      description: 'Sweet endings to your meal',
      orderIndex: 3,
      menuCategoryItems: [
        {
          id: 'item-6',
          orderIndex: 1,
          menuItem: {
            id: 'menu-item-6',
            name: 'Chocolate Cake',
            description: 'Rich chocolate cake with vanilla ice cream',
            price: 6.99,
            isAvailable: true,
            hasOptions: false,
            options: [],
            allergens: [
              { id: 'allergen-6', name: 'Dairy', description: 'Contains dairy products', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
              { id: 'allergen-7', name: 'Gluten', description: 'Contains gluten', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
              { id: 'allergen-8', name: 'Eggs', description: 'Contains eggs', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            ],
          },
        },
        {
          id: 'item-7',
          orderIndex: 2,
          menuItem: {
            id: 'menu-item-7',
            name: 'Tiramisu',
            description: 'Classic Italian dessert with coffee and mascarpone',
            price: 7.99,
            isAvailable: true,
            hasOptions: false,
            options: [],
            allergens: [
              { id: 'allergen-9', name: 'Dairy', description: 'Contains dairy products', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
              { id: 'allergen-10', name: 'Eggs', description: 'Contains eggs', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
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
    restaurantId: 'restaurant-1',
    className: 'p-6',
  },
}

export const MinimalMenu: Story = {
  args: {
    menu: {
      ...mockMenu,
      name: 'Simple Menu',
      description: 'Just a few items',
      categories: [
        {
          id: 'cat-1',
          name: 'Food',
          description: '',
          orderIndex: 1,
          menuCategoryItems: [
            {
              id: 'item-1',
              orderIndex: 1,
              menuItem: {
                id: 'menu-item-1',
                name: 'Simple Sandwich',
                description: 'A basic sandwich',
                price: 5.99,
                isAvailable: true,
                hasOptions: false,
                options: [],
                allergens: [],
              },
            },
          ],
        },
      ],
    },
    restaurantId: 'restaurant-1',
    className: 'p-6',
  },
}