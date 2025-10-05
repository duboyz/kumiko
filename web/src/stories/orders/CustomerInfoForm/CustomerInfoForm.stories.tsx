import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { CustomerInfoForm } from './CustomerInfoForm'
import { CustomerInfo } from '../shared/types'

const meta: Meta<typeof CustomerInfoForm> = {
  title: 'Orders/CustomerInfoForm',
  component: CustomerInfoForm,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof CustomerInfoForm>

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
    <div className="w-full max-w-md">
      <CustomerInfoForm
        customerInfo={customerInfo}
        onCustomerInfoChange={handleCustomerInfoChange}
      />
    </div>
  )
}

export const Default: Story = {
  render: Template,
}
