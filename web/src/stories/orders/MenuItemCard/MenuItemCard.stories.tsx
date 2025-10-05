import type { Meta, StoryObj } from '@storybook/react'
import { MenuItemCard } from './MenuItemCard'
import { GetMenuByIdResult } from '@shared'

const meta: Meta<typeof MenuItemCard> = {
  title: 'Orders/MenuItemCard',
  component: MenuItemCard,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onAddToCart: { action: 'add to cart' },
  },
}

export default meta
type Story = StoryObj<typeof MenuItemCard>

// Mock data for stories
const basicItem: NonNullable<GetMenuByIdResult['categories'][0]['menuCategoryItems'][0]['menuItem']> = {
  id: '1',
  name: 'Margherita Pizza',
  description: 'Classic tomato and mozzarella pizza with fresh basil',
  price: 12.99,
  isAvailable: true,
  hasOptions: false,
  options: [],
  allergens: [],
}

const itemWithAllergens: NonNullable<GetMenuByIdResult['categories'][0]['menuCategoryItems'][0]['menuItem']> = {
  id: '2',
  name: 'Caesar Salad',
  description: 'Fresh romaine lettuce with parmesan cheese and croutons',
  price: 8.99,
  isAvailable: true,
  hasOptions: false,
  options: [],
  allergens: [
    { id: '1', name: 'Dairy', description: 'Contains dairy products', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '2', name: 'Gluten', description: 'Contains gluten', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ],
}

const itemWithOptions: NonNullable<GetMenuByIdResult['categories'][0]['menuCategoryItems'][0]['menuItem']> = {
  id: '3',
  name: 'Burger',
  description: 'Juicy beef patty with lettuce, tomato, and onion',
  price: 0, // Base price is 0 when there are options
  isAvailable: true,
  hasOptions: true,
  options: [
      {
        id: 'opt1',
        name: 'Regular',
        description: 'Single patty',
        price: 10.99,
        orderIndex: 1,
      },
      {
        id: 'opt2',
        name: 'Double',
        description: 'Double patty',
        price: 13.99,
        orderIndex: 2,
      },
  ],
  allergens: [],
}

const unavailableItem: NonNullable<GetMenuByIdResult['categories'][0]['menuCategoryItems'][0]['menuItem']> = {
  id: '4',
  name: 'Unavailable Item',
  description: 'This item is not available',
  price: 9.99,
  isAvailable: false,
  hasOptions: false,
  options: [],
  allergens: [],
}

export const Basic: Story = {
  args: {
    item: basicItem,
    onAddToCart: (menuItemId, menuItemName, price, menuItemOptionId, menuItemOptionName) =>
      console.log('Add to cart:', { menuItemId, menuItemName, price, menuItemOptionId, menuItemOptionName }),
  },
}

export const WithAllergens: Story = {
  args: {
    item: itemWithAllergens,
    onAddToCart: (menuItemId, menuItemName, price, menuItemOptionId, menuItemOptionName) =>
      console.log('Add to cart:', { menuItemId, menuItemName, price, menuItemOptionId, menuItemOptionName }),
  },
}

export const WithOptions: Story = {
  args: {
    item: itemWithOptions,
    onAddToCart: (menuItemId, menuItemName, price, menuItemOptionId, menuItemOptionName) =>
      console.log('Add to cart:', { menuItemId, menuItemName, price, menuItemOptionId, menuItemOptionName }),
  },
}

export const Unavailable: Story = {
  args: {
    item: unavailableItem,
    onAddToCart: (menuItemId, menuItemName, price, menuItemOptionId, menuItemOptionName) =>
      console.log('Add to cart:', { menuItemId, menuItemName, price, menuItemOptionId, menuItemOptionName }),
  },
}
