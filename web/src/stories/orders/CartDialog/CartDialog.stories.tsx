import type { Meta, StoryObj } from '@storybook/react'
import { CartDialog } from './CartDialog'
import { CartItem } from '../shared/types'

const meta: Meta<typeof CartDialog> = {
  title: 'Orders/CartDialog',
  component: CartDialog,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onOpenChange: { action: 'open changed' },
    onUpdateQuantity: { action: 'quantity updated' },
    onRemoveItem: { action: 'item removed' },
    onProceedToCheckout: { action: 'proceed to checkout' },
  },
}

export default meta
type Story = StoryObj<typeof CartDialog>

const emptyCart: CartItem[] = []

const sampleCart: CartItem[] = [
  {
    menuItemId: '1',
    menuItemName: 'Margherita Pizza',
    price: 12.99,
    quantity: 2,
  },
  {
    menuItemId: '2',
    menuItemName: 'Caesar Salad',
    menuItemOptionId: 'large',
    menuItemOptionName: 'Large',
    price: 8.99,
    quantity: 1,
  },
  {
    menuItemId: '3',
    menuItemName: 'Chocolate Cake',
    price: 6.99,
    quantity: 3,
  },
]

export const Empty: Story = {
  args: {
    open: true,
    onOpenChange: () => console.log('Dialog open changed'),
    cart: emptyCart,
    onUpdateQuantity: (index, delta) => console.log(`Update quantity for index ${index} by ${delta}`),
    onRemoveItem: (index) => console.log(`Remove item at index ${index}`),
    onProceedToCheckout: () => console.log('Proceed to checkout'),
  },
}

export const WithItems: Story = {
  args: {
    open: true,
    onOpenChange: () => console.log('Dialog open changed'),
    cart: sampleCart,
    onUpdateQuantity: (index, delta) => console.log(`Update quantity for index ${index} by ${delta}`),
    onRemoveItem: (index) => console.log(`Remove item at index ${index}`),
    onProceedToCheckout: () => console.log('Proceed to checkout'),
  },
}
