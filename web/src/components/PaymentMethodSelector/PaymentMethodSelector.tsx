'use client'

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { CreditCard, Wallet } from 'lucide-react'

export type PaymentMethod = 'pay_now' | 'pay_on_pickup'

interface PaymentMethodSelectorProps {
  value: PaymentMethod
  onChange: (value: PaymentMethod) => void
  disabled?: boolean
}

export function PaymentMethodSelector({ value, onChange, disabled }: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">Payment Method</Label>
      <RadioGroup value={value} onValueChange={onChange} disabled={disabled}>
        <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
          <RadioGroupItem value="pay_now" id="pay_now" />
          <Label htmlFor="pay_now" className="flex-1 cursor-pointer flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-gray-600" />
            <div>
              <div className="font-medium">Pay Now</div>
              <div className="text-sm text-gray-500">Pay securely online with your card</div>
            </div>
          </Label>
        </div>
        <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
          <RadioGroupItem value="pay_on_pickup" id="pay_on_pickup" />
          <Label htmlFor="pay_on_pickup" className="flex-1 cursor-pointer flex items-center gap-2">
            <Wallet className="h-5 w-5 text-gray-600" />
            <div>
              <div className="font-medium">Pay on Pickup</div>
              <div className="text-sm text-gray-500">Pay when you collect your order</div>
            </div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  )
}

