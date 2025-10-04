import type { Meta, StoryObj } from '@storybook/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { OrderForm } from './OrderForm'
import { GetMenuByIdResult } from '@shared'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
})

const meta = {
  title: 'Orders/OrderForm',
  component: OrderForm,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    Story => (
      <QueryClientProvider client={queryClient}>
        <div className="p-6">
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof OrderForm>

export default meta
type Story = StoryObj<typeof meta>

const mockMenu: GetMenuByIdResult = {
  id: 'menu-1',
  name: 'Summer Menu 2025',
  description: 'Fresh seasonal dishes featuring local ingredients',
  restaurantId: 'restaurant-1',
  isActive: true,
  categories: [
    {
      id: 'category-1',
      name: 'Starters',
      description: 'Light bites to begin your meal',
      orderIndex: 0,
      menuCategoryItems: [
        {
          id: 'cat-item-1',
          orderIndex: 0,
          menuItem: {
            id: 'item-1',
            name: 'Caesar Salad',
            description: 'Crisp romaine lettuce with parmesan and croutons',
            price: 8.99,
            isAvailable: true,
            hasOptions: false,
            options: [],
            allergens: [
              { id: 'allergen-1', name: 'Gluten', icon: '🌾' },
              { id: 'allergen-2', name: 'Dairy', icon: '🥛' },
            ],
          },
        },
        {
          id: 'cat-item-2',
          orderIndex: 1,
          menuItem: {
            id: 'item-2',
            name: 'Tomato Soup',
            description: 'Homemade tomato soup with fresh basil',
            price: 6.99,
            isAvailable: true,
            hasOptions: true,
            options: [
              {
                id: 'option-1',
                name: 'Cup',
                description: '8oz serving',
                price: 6.99,
                orderIndex: 0,
                isAvailable: true,
              },
              {
                id: 'option-2',
                name: 'Bowl',
                description: '12oz serving',
                price: 9.99,
                orderIndex: 1,
                isAvailable: true,
              },
            ],
            allergens: [],
          },
        },
      ],
    },
    {
      id: 'category-2',
      name: 'Main Courses',
      description: 'Hearty dishes for the main event',
      orderIndex: 1,
      menuCategoryItems: [
        {
          id: 'cat-item-3',
          orderIndex: 0,
          menuItem: {
            id: 'item-3',
            name: 'Margherita Pizza',
            description: 'Classic pizza with tomato, mozzarella, and basil',
            price: 14.99,
            isAvailable: true,
            hasOptions: true,
            options: [
              {
                id: 'option-3',
                name: 'Small (10")',
                price: 14.99,
                orderIndex: 0,
                isAvailable: true,
              },
              {
                id: 'option-4',
                name: 'Medium (12")',
                price: 18.99,
                orderIndex: 1,
                isAvailable: true,
              },
              {
                id: 'option-5',
                name: 'Large (14")',
                price: 22.99,
                orderIndex: 2,
                isAvailable: true,
              },
            ],
            allergens: [
              { id: 'allergen-1', name: 'Gluten', icon: '🌾' },
              { id: 'allergen-2', name: 'Dairy', icon: '🥛' },
            ],
          },
        },
        {
          id: 'cat-item-4',
          orderIndex: 1,
          menuItem: {
            id: 'item-4',
            name: 'Grilled Salmon',
            description: 'Atlantic salmon with lemon butter sauce',
            price: 24.99,
            isAvailable: true,
            hasOptions: false,
            options: [],
            allergens: [{ id: 'allergen-3', name: 'Fish', icon: '🐟' }],
          },
        },
        {
          id: 'cat-item-5',
          orderIndex: 2,
          menuItem: {
            id: 'item-5',
            name: 'Pasta Carbonara',
            description: 'Traditional Italian pasta with eggs, cheese, and bacon',
            price: 16.99,
            isAvailable: true,
            hasOptions: false,
            options: [],
            allergens: [
              { id: 'allergen-1', name: 'Gluten', icon: '🌾' },
              { id: 'allergen-2', name: 'Dairy', icon: '🥛' },
              { id: 'allergen-4', name: 'Eggs', icon: '🥚' },
            ],
          },
        },
      ],
    },
    {
      id: 'category-3',
      name: 'Desserts',
      description: 'Sweet treats to finish your meal',
      orderIndex: 2,
      menuCategoryItems: [
        {
          id: 'cat-item-6',
          orderIndex: 0,
          menuItem: {
            id: 'item-6',
            name: 'Tiramisu',
            description: 'Classic Italian dessert with coffee and mascarpone',
            price: 7.99,
            isAvailable: true,
            hasOptions: false,
            options: [],
            allergens: [
              { id: 'allergen-2', name: 'Dairy', icon: '🥛' },
              { id: 'allergen-4', name: 'Eggs', icon: '🥚' },
            ],
          },
        },
        {
          id: 'cat-item-7',
          orderIndex: 1,
          menuItem: {
            id: 'item-7',
            name: 'Chocolate Lava Cake',
            description: 'Warm chocolate cake with molten center',
            price: 8.99,
            isAvailable: true,
            hasOptions: false,
            options: [],
            allergens: [
              { id: 'allergen-1', name: 'Gluten', icon: '🌾' },
              { id: 'allergen-2', name: 'Dairy', icon: '🥛' },
              { id: 'allergen-4', name: 'Eggs', icon: '🥚' },
            ],
          },
        },
      ],
    },
    {
      id: 'category-4',
      name: 'Beverages',
      description: 'Refreshing drinks',
      orderIndex: 3,
      menuCategoryItems: [
        {
          id: 'cat-item-8',
          orderIndex: 0,
          menuItem: {
            id: 'item-8',
            name: 'Soft Drinks',
            description: 'Coca-Cola, Sprite, Fanta',
            price: 2.99,
            isAvailable: true,
            hasOptions: false,
            options: [],
            allergens: [],
          },
        },
        {
          id: 'cat-item-9',
          orderIndex: 1,
          menuItem: {
            id: 'item-9',
            name: 'Fresh Lemonade',
            description: 'Homemade lemonade with fresh lemons',
            price: 3.99,
            isAvailable: true,
            hasOptions: false,
            options: [],
            allergens: [],
          },
        },
      ],
    },
  ],
}

const mockMenuSimple: GetMenuByIdResult = {
  id: 'menu-2',
  name: 'Quick Lunch Menu',
  description: 'Fast and delicious lunch options',
  restaurantId: 'restaurant-1',
  isActive: true,
  categories: [
    {
      id: 'category-5',
      name: 'Sandwiches',
      orderIndex: 0,
      menuCategoryItems: [
        {
          id: 'cat-item-10',
          orderIndex: 0,
          menuItem: {
            id: 'item-10',
            name: 'Club Sandwich',
            description: 'Turkey, bacon, lettuce, and tomato on toasted bread',
            price: 10.99,
            isAvailable: true,
            hasOptions: false,
            options: [],
            allergens: [{ id: 'allergen-1', name: 'Gluten', icon: '🌾' }],
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
  },
}

export const SimpleMenu: Story = {
  args: {
    menu: mockMenuSimple,
    restaurantId: 'restaurant-1',
  },
}

export const WithLongDescription: Story = {
  args: {
    menu: {
      ...mockMenu,
      description:
        'Experience our carefully curated summer menu featuring the finest seasonal ingredients sourced from local farms. Each dish is prepared with love and attention to detail by our award-winning chefs.',
    },
    restaurantId: 'restaurant-1',
  },
}

