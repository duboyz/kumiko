import type { Meta, StoryObj } from '@storybook/react'
import { CartButton } from './CartButton'
import { CartItem } from '../shared/types'

const meta: Meta<typeof CartButton> = {
  title: 'Orders/CartButton',
  component: CartButton,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    onClick: { action: 'clicked' },
  },
}

export default meta
type Story = StoryObj<typeof CartButton>

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
]

export const Empty: Story = {
  args: {
    cart: emptyCart,
    onClick: () => console.log('Cart clicked'),
  },
}

export const WithItems: Story = {
  args: {
    cart: sampleCart,
    onClick: () => console.log('Cart clicked'),
  },
}
