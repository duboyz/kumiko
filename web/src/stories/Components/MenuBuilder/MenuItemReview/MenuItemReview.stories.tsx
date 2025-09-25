import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { MenuItemReview } from './MenuItemReview'

const mockCategories = [
  {
    id: '1',
    name: 'Appetizers',
    description: 'Starter dishes',
    orderIndex: 1,
    restaurantMenuId: '1',
  },
  {
    id: '2',
    name: 'Main Courses',
    description: 'Entrees',
    orderIndex: 2,
    restaurantMenuId: '1',
  },
  {
    id: '3',
    name: 'Desserts',
    description: 'Sweet treats',
    orderIndex: 3,
    restaurantMenuId: '1',
  },
]

const mockHighConfidenceItems = [
  {
    id: '1',
    name: 'Grilled Salmon',
    description: 'Fresh Atlantic salmon with lemon butter',
    price: 24.99,
    confidence: 0.95,
  },
  {
    id: '2',
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce with parmesan',
    price: 12.50,
    confidence: 0.88,
  },
]

const mockMediumConfidenceItems = [
  {
    id: '1',
    name: 'Chicken Parmesan',
    description: 'Breaded chicken breast with marinara',
    price: 18.99,
    confidence: 0.72,
  },
  {
    id: '2',
    name: 'Beef Stir Fry',
    description: 'Tender beef with mixed vegetables',
    price: 16.50,
    confidence: 0.65,
  },
]

const mockLowConfidenceItems = [
  {
    id: '1',
    name: 'Special Dish',
    description: 'Chef special for today',
    price: 22.00,
    confidence: 0.45,
  },
  {
    id: '2',
    name: 'Mystery Soup',
    description: 'Daily soup selection',
    price: 8.99,
    confidence: 0.32,
  },
]

const meta: Meta<typeof MenuItemReview> = {
  component: MenuItemReview,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    isLoading: {
      control: 'boolean',
      description: 'Whether the component is in loading state',
    },
    onConfirm: {
      action: 'items confirmed',
      description: 'Function called when items are confirmed',
    },
    onCancel: {
      action: 'review cancelled',
      description: 'Function called when review is cancelled',
    },
    onCategoryChange: {
      action: 'category changed',
      description: 'Function called when category selection changes',
    },
  },
}

export default meta

type Story = StoryObj<typeof MenuItemReview>

export const HighConfidenceItems: Story = {
  args: {
    initialItems: mockHighConfidenceItems,
    categories: mockCategories,
    selectedCategoryId: '2',
    onCategoryChange: (categoryId: string) => console.log('Category changed:', categoryId),
    onConfirm: (items) => console.log('Confirmed items:', items),
    onCancel: () => console.log('Review cancelled'),
    isLoading: false,
  },
}

export const MediumConfidenceItems: Story = {
  args: {
    initialItems: mockMediumConfidenceItems,
    categories: mockCategories,
    selectedCategoryId: '2',
    onCategoryChange: (categoryId: string) => console.log('Category changed:', categoryId),
    onConfirm: (items) => console.log('Confirmed items:', items),
    onCancel: () => console.log('Review cancelled'),
    isLoading: false,
  },
}

export const LowConfidenceItems: Story = {
  args: {
    initialItems: mockLowConfidenceItems,
    categories: mockCategories,
    selectedCategoryId: '2',
    onCategoryChange: (categoryId: string) => console.log('Category changed:', categoryId),
    onConfirm: (items) => console.log('Confirmed items:', items),
    onCancel: () => console.log('Review cancelled'),
    isLoading: false,
  },
}

export const EmptyItems: Story = {
  args: {
    initialItems: [],
    categories: mockCategories,
    selectedCategoryId: '1',
    onCategoryChange: (categoryId: string) => console.log('Category changed:', categoryId),
    onConfirm: (items) => console.log('Confirmed items:', items),
    onCancel: () => console.log('Review cancelled'),
    isLoading: false,
  },
}

export const NoCategories: Story = {
  args: {
    initialItems: mockHighConfidenceItems,
    categories: [],
    selectedCategoryId: '',
    onCategoryChange: (categoryId: string) => console.log('Category changed:', categoryId),
    onConfirm: (items) => console.log('Confirmed items:', items),
    onCancel: () => console.log('Review cancelled'),
    isLoading: false,
  },
}

export const LoadingState: Story = {
  args: {
    initialItems: mockHighConfidenceItems,
    categories: mockCategories,
    selectedCategoryId: '2',
    onCategoryChange: (categoryId: string) => console.log('Category changed:', categoryId),
    onConfirm: (items) => console.log('Confirmed items:', items),
    onCancel: () => console.log('Review cancelled'),
    isLoading: true,
  },
}

export const ManyItems: Story = {
  args: {
    initialItems: [
      ...mockHighConfidenceItems,
      ...mockMediumConfidenceItems,
      ...mockLowConfidenceItems,
      {
        id: '7',
        name: 'Pizza Margherita',
        description: 'Traditional Italian pizza with tomatoes and mozzarella',
        price: 16.99,
        confidence: 0.91,
      },
      {
        id: '8',
        name: 'Fish & Chips',
        description: 'Beer battered cod with thick cut chips',
        price: 19.50,
        confidence: 0.87,
      },
    ],
    categories: mockCategories,
    selectedCategoryId: '2',
    onCategoryChange: (categoryId: string) => console.log('Category changed:', categoryId),
    onConfirm: (items) => console.log('Confirmed items:', items),
    onCancel: () => console.log('Review cancelled'),
    isLoading: false,
  },
}

export const InteractionDemo = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">Menu Item Review</h3>
        <p className="text-sm text-gray-600 mb-4">
          This component allows users to review and edit AI-extracted menu items. Try editing the fields, removing items, or adding new ones.
        </p>
        <MenuItemReview
          initialItems={mockMediumConfidenceItems}
          categories={mockCategories}
          selectedCategoryId="2"
          onCategoryChange={(categoryId) => console.log('Demo category changed:', categoryId)}
          onConfirm={(items) => {
            console.log('Demo items confirmed:', items)
            alert(`Confirmed ${items.length} items! Check console for details.`)
          }}
          onCancel={() => {
            console.log('Demo review cancelled')
            alert('Review cancelled!')
          }}
          isLoading={false}
        />
      </div>
    </div>
  )
}