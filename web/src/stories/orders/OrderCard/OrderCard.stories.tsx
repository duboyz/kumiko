import type { Meta, StoryObj } from '@storybook/react'
import { OrderCard } from './OrderCard'
import { OrderStatus } from '@shared/types'

const meta = {
  title: 'Orders/OrderCard',
  component: OrderCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof OrderCard>

export default meta
type Story = StoryObj<typeof meta>

const baseOrder = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  restaurantId: '456e4567-e89b-12d3-a456-426614174001',
  restaurantName: 'The Gourmet Kitchen',
  customerName: 'John Doe',
  customerEmail: 'john.doe@example.com',
  customerPhone: '+1 (555) 123-4567',
  pickupDateTime: '2025-10-03T18:30:00Z',
  totalAmount: 45.50,
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
}

export const Pending: Story = {
  args: {
    order: {
      ...baseOrder,
      status: OrderStatus.Pending,
    },
  },
}

export const Confirmed: Story = {
  args: {
    order: {
      ...baseOrder,
      status: OrderStatus.Confirmed,
    },
  },
}

export const Preparing: Story = {
  args: {
    order: {
      ...baseOrder,
      status: OrderStatus.Preparing,
    },
  },
}

export const Ready: Story = {
  args: {
    order: {
      ...baseOrder,
      status: OrderStatus.Ready,
    },
  },
}

export const PickedUp: Story = {
  args: {
    order: {
      ...baseOrder,
      status: OrderStatus.PickedUp,
    },
  },
}

export const Cancelled: Story = {
  args: {
    order: {
      ...baseOrder,
      status: OrderStatus.Cancelled,
    },
  },
}

export const WithNotes: Story = {
  args: {
    order: {
      ...baseOrder,
      status: OrderStatus.Confirmed,
      notes: 'Please call when ready for pickup. I will be waiting in the parking lot.',
    },
  },
}

export const LargeOrder: Story = {
  args: {
    order: {
      ...baseOrder,
      status: OrderStatus.Preparing,
      totalAmount: 156.75,
      items: [
        {
          id: 'item-1',
          itemName: 'Margherita Pizza',
          itemDescription: 'Classic pizza with tomato sauce, mozzarella, and basil',
          itemPrice: 18.99,
          quantity: 3,
          subtotal: 56.97,
        },
        {
          id: 'item-2',
          itemName: 'Caesar Salad',
          itemDescription: 'Romaine lettuce, croutons, parmesan, caesar dressing',
          itemPrice: 12.99,
          quantity: 2,
          subtotal: 25.98,
        },
        {
          id: 'item-3',
          itemName: 'Grilled Salmon',
          itemDescription: 'Fresh Atlantic salmon with lemon butter sauce',
          itemPrice: 24.99,
          quantity: 2,
          subtotal: 49.98,
          specialInstructions: 'Well done please',
        },
        {
          id: 'item-4',
          itemName: 'Tiramisu',
          itemDescription: 'Classic Italian dessert',
          itemPrice: 7.99,
          quantity: 3,
          subtotal: 23.97,
        },
      ],
    },
  },
}
