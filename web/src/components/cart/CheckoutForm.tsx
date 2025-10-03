'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useCart } from '@/contexts/CartContext'
import { useCreateOrder, useCurrentUser } from '@shared'
import { useState } from 'react'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'

interface CheckoutFormProps {
  onSuccess: () => void
  onBack: () => void
}

export function CheckoutForm({ onSuccess, onBack }: CheckoutFormProps) {
  const { items, restaurantId, clearCart } = useCart()
  const { data: userData } = useCurrentUser()
  const createOrder = useCreateOrder(() => {
    toast.success('Order placed successfully!')
    clearCart()
    onSuccess()
  })

  const [customerName, setCustomerName] = useState(
    userData ? `${userData.firstName || ''} ${userData.lastName || ''}`.trim() : ''
  )
  const [customerEmail, setCustomerEmail] = useState(userData?.email || '')
  const [customerPhone, setCustomerPhone] = useState(userData?.phoneNumber || '')
  const [pickupDate, setPickupDate] = useState('')
  const [pickupTime, setPickupTime] = useState('')
  const [notes, setNotes] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!restaurantId) {
      toast.error('No restaurant selected')
      return
    }

    if (!pickupDate || !pickupTime) {
      toast.error('Please select pickup date and time')
      return
    }

    const pickupDateTime = new Date(`${pickupDate}T${pickupTime}`).toISOString()

    createOrder.mutate({
      restaurantId,
      customerName,
      customerEmail,
      customerPhone,
      pickupDateTime,
      notes: notes || undefined,
      items: items.map(item => ({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        specialInstructions: item.specialInstructions,
      })),
    })
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0]

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4 overflow-y-auto">
      <Button type="button" variant="ghost" size="sm" className="w-fit" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Cart
      </Button>

      <div className="space-y-4">
        <div>
          <Label htmlFor="customerName">Name *</Label>
          <Input
            id="customerName"
            value={customerName}
            onChange={e => setCustomerName(e.target.value)}
            required
            placeholder="Your name"
          />
        </div>

        <div>
          <Label htmlFor="customerEmail">Email *</Label>
          <Input
            id="customerEmail"
            type="email"
            value={customerEmail}
            onChange={e => setCustomerEmail(e.target.value)}
            required
            placeholder="your@email.com"
          />
        </div>

        <div>
          <Label htmlFor="customerPhone">Phone *</Label>
          <Input
            id="customerPhone"
            type="tel"
            value={customerPhone}
            onChange={e => setCustomerPhone(e.target.value)}
            required
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div>
          <Label htmlFor="pickupDate">Pickup Date *</Label>
          <Input
            id="pickupDate"
            type="date"
            value={pickupDate}
            onChange={e => setPickupDate(e.target.value)}
            required
            min={today}
          />
        </div>

        <div>
          <Label htmlFor="pickupTime">Pickup Time *</Label>
          <Input
            id="pickupTime"
            type="time"
            value={pickupTime}
            onChange={e => setPickupTime(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="notes">Order Notes (Optional)</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Any special requests or notes..."
            className="h-20"
          />
        </div>
      </div>

      <div className="mt-auto pt-4 border-t">
        <Button type="submit" className="w-full" size="lg" disabled={createOrder.isPending}>
          {createOrder.isPending ? 'Placing Order...' : 'Place Order'}
        </Button>
      </div>
    </form>
  )
}
