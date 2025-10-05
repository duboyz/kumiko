import type { Meta, StoryObj } from '@storybook/react'
import { CartItemCard } from './CartItemCard'
import { CartItem } from '../shared/types'
import { useState } from 'react'

const meta: Meta<typeof CartItemCard> = {
  title: 'Orders/CartItemCard',
  component: CartItemCard,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    onUpdateQuantity: { action: 'quantity updated' },
    onRemove: { action: 'item removed' },
  },
}

export default meta
type Story = StoryObj<typeof CartItemCard>

const sampleItem: CartItem = {
  menuItemId: '1',
  menuItemName: 'Margherita Pizza',
  price: 12.99,
  quantity: 2,
}

const itemWithOption: CartItem = {
  menuItemId: '2',
  menuItemName: 'Caesar Salad',
  menuItemOptionId: 'large',
  menuItemOptionName: 'Large',
  price: 8.99,
  quantity: 1,
}

export const Basic: Story = {
  args: {
    item: sampleItem,
    index: 0,
    onUpdateQuantity: (index, delta) => console.log(`Update quantity for index ${index} by ${delta}`),
    onRemove: (index) => console.log(`Remove item at index ${index}`),
  },
}

export const WithOption: Story = {
  args: {
    item: itemWithOption,
    index: 1,
    onUpdateQuantity: (index, delta) => console.log(`Update quantity for index ${index} by ${delta}`),
    onRemove: (index) => console.log(`Remove item at index ${index}`),
  },
}

export const SomeComponent = () => {
  const [item, setItem] = useState(sampleItem)

  const handleUpdateQuantity = (index: number, delta: number) => {
    console.log('handleUpdateQuantity called with delta:', delta, 'current quantity:', item.quantity)
    setItem(prev => {
      const newQuantity = Math.max(0, prev.quantity + delta)
      console.log('Setting new quantity to:', newQuantity)
      return { ...prev, quantity: newQuantity }
    })
  }

  return (
    <div className="w-full border p-4 max-w-2xl">
      <CartItemCard
        item={item}
        index={0}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={(index) => console.log(`Remove item at index ${index}`)}
      />
    </div>

  )
}
