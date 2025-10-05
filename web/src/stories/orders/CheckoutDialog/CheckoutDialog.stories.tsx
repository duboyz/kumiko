import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { CheckoutDialog } from './CheckoutDialog'
import { CartItem, CustomerInfo } from '../shared/types'

const meta: Meta<typeof CheckoutDialog> = {
  title: 'Orders/CheckoutDialog',
  component: CheckoutDialog,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onOpenChange: { action: 'open changed' },
    onSubmitOrder: { action: 'order submitted' },
  },
}

export default meta
type Story = StoryObj<typeof CheckoutDialog>

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

const Template = () => {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    email: '',
    pickupDate: '',
    pickupTime: '12:00',
    additionalNote: '',
  })

  const handleCustomerInfoChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }))
  }

  return (
    <CheckoutDialog
      open={true}
      onOpenChange={() => console.log('Dialog open changed')}
      cart={sampleCart}
      customerInfo={customerInfo}
      onCustomerInfoChange={handleCustomerInfoChange}
      onSubmitOrder={() => console.log('Order submitted')}
      isSubmitting={false}
    />
  )
}

export const Default: Story = {
  render: Template,
}

export const WithFilledForm: Story = {
  render: () => {
    const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
      name: 'John Doe',
      phone: '555-1234',
      email: 'john@example.com',
      pickupDate: '2024-01-15',
      pickupTime: '18:00',
      additionalNote: 'Please ring the doorbell twice',
    })

    const handleCustomerInfoChange = (field: keyof CustomerInfo, value: string) => {
      setCustomerInfo(prev => ({ ...prev, [field]: value }))
    }

    return (
      <CheckoutDialog
        open={true}
        onOpenChange={() => console.log('Dialog open changed')}
        cart={sampleCart}
        customerInfo={customerInfo}
        onCustomerInfoChange={handleCustomerInfoChange}
        onSubmitOrder={() => console.log('Order submitted')}
        isSubmitting={false}
      />
    )
  },
}

export const Submitting: Story = {
  render: () => {
    const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
      name: 'John Doe',
      phone: '555-1234',
      email: 'john@example.com',
      pickupDate: '2024-01-15',
      pickupTime: '18:00',
      additionalNote: 'Please ring the doorbell twice',
    })

    const handleCustomerInfoChange = (field: keyof CustomerInfo, value: string) => {
      setCustomerInfo(prev => ({ ...prev, [field]: value }))
    }

    return (
      <CheckoutDialog
        open={true}
        onOpenChange={() => console.log('Dialog open changed')}
        cart={sampleCart}
        customerInfo={customerInfo}
        onCustomerInfoChange={handleCustomerInfoChange}
        onSubmitOrder={() => console.log('Order submitted')}
        isSubmitting={true}
      />
    )
  },
}
