import type { Meta, StoryObj } from '@storybook/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { OrdersList } from './OrdersList'
import { OrderDto } from '@shared'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
})

const meta = {
  title: 'Orders/OrdersList',
  component: OrdersList,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    Story => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof OrdersList>

export default meta
type Story = StoryObj<typeof meta>

const mockOrders: OrderDto[] = [
  {
    id: '1',
    customerName: 'John Doe',
    customerPhone: '555-1234',
    customerEmail: 'john@example.com',
    pickupDate: '2025-10-15',
    pickupTime: '12:30',
    additionalNote: 'Please add extra napkins',
    status: 'Pending',
    totalAmount: 45.99,
    restaurantId: 'restaurant-1',
    restaurantMenuId: 'menu-1',
    orderItems: [
      {
        id: 'item-1',
        menuItemId: 'menu-item-1',
        menuItemName: 'Margherita Pizza',
        menuItemOptionId: 'option-1',
        menuItemOptionName: 'Large',
        quantity: 2,
        priceAtOrder: 18.99,
        specialInstructions: 'Extra cheese please',
      },
      {
        id: 'item-2',
        menuItemId: 'menu-item-2',
        menuItemName: 'Caesar Salad',
        quantity: 1,
        priceAtOrder: 8.99,
      },
    ],
    createdAt: '2025-10-04T10:00:00Z',
    updatedAt: '2025-10-04T10:00:00Z',
  },
  {
    id: '2',
    customerName: 'Jane Smith',
    customerPhone: '555-5678',
    customerEmail: 'jane@example.com',
    pickupDate: '2025-10-15',
    pickupTime: '13:00',
    additionalNote: '',
    status: 'Confirmed',
    totalAmount: 32.5,
    restaurantId: 'restaurant-1',
    restaurantMenuId: 'menu-1',
    orderItems: [
      {
        id: 'item-3',
        menuItemId: 'menu-item-3',
        menuItemName: 'Pasta Carbonara',
        quantity: 1,
        priceAtOrder: 16.99,
      },
      {
        id: 'item-4',
        menuItemId: 'menu-item-4',
        menuItemName: 'Tiramisu',
        quantity: 2,
        priceAtOrder: 7.99,
      },
    ],
    createdAt: '2025-10-04T10:15:00Z',
    updatedAt: '2025-10-04T10:30:00Z',
  },
  {
    id: '3',
    customerName: 'Bob Johnson',
    customerPhone: '555-9012',
    customerEmail: 'bob@example.com',
    pickupDate: '2025-10-15',
    pickupTime: '14:00',
    additionalNote: 'Allergic to nuts',
    status: 'Ready',
    totalAmount: 28.99,
    restaurantId: 'restaurant-1',
    restaurantMenuId: 'menu-1',
    orderItems: [
      {
        id: 'item-5',
        menuItemId: 'menu-item-5',
        menuItemName: 'Grilled Chicken',
        menuItemOptionId: 'option-2',
        menuItemOptionName: 'With vegetables',
        quantity: 1,
        priceAtOrder: 22.99,
        specialInstructions: 'Well done',
      },
      {
        id: 'item-6',
        menuItemId: 'menu-item-6',
        menuItemName: 'Lemonade',
        quantity: 1,
        priceAtOrder: 3.99,
      },
    ],
    createdAt: '2025-10-04T09:00:00Z',
    updatedAt: '2025-10-04T11:00:00Z',
  },
]

export const Default: Story = {
  args: {
    orders: mockOrders,
    isLoading: false,
  },
}

export const Loading: Story = {
  args: {
    orders: [],
    isLoading: true,
  },
}

export const Empty: Story = {
  args: {
    orders: [],
    isLoading: false,
  },
}

export const SingleOrder: Story = {
  args: {
    orders: [mockOrders[0]],
    isLoading: false,
  },
}

export const PendingOrders: Story = {
  args: {
    orders: mockOrders.filter(o => o.status === 'Pending'),
    isLoading: false,
  },
}

export const ConfirmedOrders: Story = {
  args: {
    orders: mockOrders.filter(o => o.status === 'Confirmed'),
    isLoading: false,
  },
}

export const ReadyOrders: Story = {
  args: {
    orders: mockOrders.filter(o => o.status === 'Ready'),
    isLoading: false,
  },
}

export const CompletedOrder: Story = {
  args: {
    orders: [
      {
        ...mockOrders[0],
        status: 'Completed',
      },
    ],
    isLoading: false,
  },
}

export const CancelledOrder: Story = {
  args: {
    orders: [
      {
        ...mockOrders[0],
        status: 'Cancelled',
      },
    ],
    isLoading: false,
  },
}

export const ManyOrders: Story = {
  args: {
    orders: [
      ...mockOrders,
      {
        ...mockOrders[0],
        id: '4',
        customerName: 'Alice Williams',
        status: 'Pending',
        pickupTime: '15:00',
      },
      {
        ...mockOrders[1],
        id: '5',
        customerName: 'Charlie Brown',
        status: 'Completed',
        pickupTime: '15:30',
      },
    ],
    isLoading: false,
  },
}

