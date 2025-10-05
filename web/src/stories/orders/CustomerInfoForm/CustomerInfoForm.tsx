import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { CustomerInfo } from '../shared/types'

interface CustomerInfoFormProps {
  customerInfo: CustomerInfo
  onCustomerInfoChange: (field: keyof CustomerInfo, value: string) => void
}

export function CustomerInfoForm({ customerInfo, onCustomerInfoChange }: CustomerInfoFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="customerName">Name *</Label>
          <Input
            id="customerName"
            value={customerInfo.name}
            onChange={e => onCustomerInfoChange('name', e.target.value)}
            placeholder="John Doe"
          />
        </div>
        <div>
          <Label htmlFor="customerPhone">Phone *</Label>
          <Input
            id="customerPhone"
            value={customerInfo.phone}
            onChange={e => onCustomerInfoChange('phone', e.target.value)}
            placeholder="555-1234"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="customerEmail">Email *</Label>
        <Input
          id="customerEmail"
          type="email"
          value={customerInfo.email}
          onChange={e => onCustomerInfoChange('email', e.target.value)}
          placeholder="john@example.com"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="pickupDate">Pickup Date *</Label>
          <Input
            id="pickupDate"
            type="date"
            value={customerInfo.pickupDate}
            onChange={e => onCustomerInfoChange('pickupDate', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div>
          <Label htmlFor="pickupTime">Pickup Time *</Label>
          <Input
            id="pickupTime"
            type="time"
            value={customerInfo.pickupTime}
            onChange={e => onCustomerInfoChange('pickupTime', e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="additionalNote">Additional Notes</Label>
        <Textarea
          id="additionalNote"
          value={customerInfo.additionalNote}
          onChange={e => onCustomerInfoChange('additionalNote', e.target.value)}
          placeholder="Any special requests or dietary restrictions?"
          rows={3}
        />
      </div>
    </div>
  )
}
