import type { Meta, StoryObj } from '@storybook/react'
import { OrderList } from './OrderList'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { OrderStatus } from '@shared/types'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const meta = {
  title: 'Orders/OrderList',
  component: OrderList,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
} satisfies Meta<typeof OrderList>

export default meta
type Story = StoryObj<typeof meta>

// Mock the useOrders hook
const mockOrders = {
  orders: [
    {
      id: '123e4567-e89b-12d3-a456-426614174000',
      restaurantId: '456e4567-e89b-12d3-a456-426614174001',
      restaurantName: 'The Gourmet Kitchen',
      customerName: 'John Doe',
      customerEmail: 'john.doe@example.com',
      customerPhone: '+1 (555) 123-4567',
      pickupDateTime: '2025-10-03T18:30:00Z',
      status: OrderStatus.Pending,
      totalAmount: 45.5,
      createdAt: '2025-10-02T14:20:00Z',
      items: [
        {
          id: 'item-1',
          itemName: 'Margherita Pizza',
          itemDescription: 'Classic pizza with tomato sauce, mozzarella, and basil',
          itemPrice: 18.99,
          quantity: 1,
          subtotal: 18.99,
        },
        {
          id: 'item-2',
          itemName: 'Caesar Salad',
          itemDescription: 'Romaine lettuce, croutons, parmesan, caesar dressing',
          itemPrice: 12.99,
          quantity: 2,
          subtotal: 25.98,
          specialInstructions: 'No croutons please',
        },
      ],
    },
    {
      id: '223e4567-e89b-12d3-a456-426614174000',
      restaurantId: '456e4567-e89b-12d3-a456-426614174001',
      restaurantName: 'The Gourmet Kitchen',
      customerName: 'Jane Smith',
      customerEmail: 'jane.smith@example.com',
      customerPhone: '+1 (555) 987-6543',
      pickupDateTime: '2025-10-03T19:00:00Z',
      status: OrderStatus.Confirmed,
      totalAmount: 32.99,
      createdAt: '2025-10-02T15:10:00Z',
      items: [
        {
          id: 'item-3',
          itemName: 'Grilled Salmon',
          itemDescription: 'Fresh Atlantic salmon with lemon butter sauce',
          itemPrice: 24.99,
          quantity: 1,
          subtotal: 24.99,
        },
        {
          id: 'item-4',
          itemName: 'Sparkling Water',
          itemDescription: 'San Pellegrino',
          itemPrice: 4.0,
          quantity: 2,
          subtotal: 8.0,
        },
      ],
    },
    {
      id: '323e4567-e89b-12d3-a456-426614174000',
      restaurantId: '456e4567-e89b-12d3-a456-426614174001',
      restaurantName: 'The Gourmet Kitchen',
      customerName: 'Bob Johnson',
      customerEmail: 'bob.j@example.com',
      customerPhone: '+1 (555) 456-7890',
      pickupDateTime: '2025-10-03T17:45:00Z',
      status: OrderStatus.Ready,
      totalAmount: 67.95,
      notes: 'Please call when ready',
      createdAt: '2025-10-02T13:30:00Z',
      items: [
        {
          id: 'item-5',
          itemName: 'Beef Burger',
          itemDescription: 'Angus beef burger with fries',
          itemPrice: 16.99,
          quantity: 2,
          subtotal: 33.98,
        },
        {
          id: 'item-6',
          itemName: 'Chocolate Cake',
          itemDescription: 'Rich chocolate layer cake',
          itemPrice: 8.99,
          quantity: 2,
          subtotal: 17.98,
        },
        {
          id: 'item-7',
          itemName: 'Iced Tea',
          itemDescription: 'Fresh brewed',
          itemPrice: 2.99,
          quantity: 3,
          subtotal: 8.97,
          specialInstructions: 'Extra ice',
        },
      ],
    },
  ],
}

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        // Mock successful orders fetch
        {
          url: '/api/orders',
          method: 'get',
          status: 200,
          response: mockOrders,
        },
      ],
    },
  },
}

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        {
          url: '/api/orders',
          method: 'get',
          delay: 'infinite',
        },
      ],
    },
  },
}

export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [
        {
          url: '/api/orders',
          method: 'get',
          status: 200,
          response: { orders: [] },
        },
      ],
    },
  },
}

export const Error: Story = {
  parameters: {
    msw: {
      handlers: [
        {
          url: '/api/orders',
          method: 'get',
          status: 500,
          response: { error: 'Failed to fetch orders' },
        },
      ],
    },
  },
}
