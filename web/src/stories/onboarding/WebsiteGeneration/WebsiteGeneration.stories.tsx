import type { Meta, StoryObj } from '@storybook/react'
import WebsiteGeneration from './WebsiteGeneration'
import { ParsedMenuStructure } from '@shared/types/menu-structure.types'

const meta: Meta<typeof WebsiteGeneration> = {
  title: 'Onboarding/WebsiteGeneration',
  component: WebsiteGeneration,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

const mockMenuData: ParsedMenuStructure = {
  suggestedMenuName: 'Restaurant Menu',
  suggestedMenuDescription: 'A delicious selection of dishes',
  categories: [
    {
      name: 'Appetizers',
      description: 'Start your meal with our delicious appetizers',
      orderIndex: 0,
      items: [
        { name: 'Bruschetta', description: 'Toasted bread with tomatoes', price: 12.0, orderIndex: 0 },
        { name: 'Caesar Salad', description: 'Fresh romaine lettuce', price: 14.0, orderIndex: 1 },
      ],
    },
    {
      name: 'Main Courses',
      description: 'Our signature main dishes',
      orderIndex: 1,
      items: [
        { name: 'Margherita Pizza', description: 'Tomato, mozzarella, basil', price: 18.0, orderIndex: 0 },
        { name: 'Pasta Carbonara', description: 'Creamy pasta with bacon', price: 20.0, orderIndex: 1 },
      ],
    },
    {
      name: 'Desserts',
      description: 'Sweet endings to your meal',
      orderIndex: 2,
      items: [
        { name: 'Tiramisu', description: 'Classic Italian dessert', price: 8.0, orderIndex: 0 },
        { name: 'Gelato', description: 'Vanilla ice cream', price: 6.0, orderIndex: 1 },
      ],
    },
  ],
}

export const Default: Story = {
  args: {},
}

export const WithMenuData: Story = {
  args: {
    menuData: mockMenuData,
  },
}

export const WithCallbacks: Story = {
  args: {
    menuData: mockMenuData,
    onWebsiteGenerated: websiteId => {
      console.log('Website generated:', websiteId)
    },
    onBack: () => {
      console.log('Back clicked')
    },
  },
}
