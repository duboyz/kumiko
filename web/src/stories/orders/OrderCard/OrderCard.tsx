'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { OrderDto, OrderStatus } from '@shared/types'
import { format } from 'date-fns'
import { Clock, MapPin, User, Phone, Mail, Package } from 'lucide-react'

interface OrderCardProps {
  order: OrderDto
}

const statusColors: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: 'bg-yellow-100 text-yellow-800',
  [OrderStatus.Confirmed]: 'bg-blue-100 text-blue-800',
  [OrderStatus.Preparing]: 'bg-purple-100 text-purple-800',
  [OrderStatus.Ready]: 'bg-green-100 text-green-800',
  [OrderStatus.PickedUp]: 'bg-gray-100 text-gray-800',
  [OrderStatus.Cancelled]: 'bg-red-100 text-red-800',
}

const statusLabels: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: 'Pending',
  [OrderStatus.Confirmed]: 'Confirmed',
  [OrderStatus.Preparing]: 'Preparing',
  [OrderStatus.Ready]: 'Ready for Pickup',
  [OrderStatus.PickedUp]: 'Picked Up',
  [OrderStatus.Cancelled]: 'Cancelled',
}

export function OrderCard({ order }: OrderCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {format(new Date(order.createdAt), 'PPP')} at {format(new Date(order.createdAt), 'p')}
            </p>
          </div>
          <Badge className={statusColors[order.status]}>{statusLabels[order.status]}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Customer Info */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Customer Information</h4>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{order.customerName}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{order.customerEmail}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>{order.customerPhone}</span>
            </div>
          </div>
        </div>

        {/* Pickup Info */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Pickup Details</h4>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{format(new Date(order.pickupDateTime), 'PPP')} at {format(new Date(order.pickupDateTime), 'p')}</span>
          </div>
          {order.restaurantName && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{order.restaurantName}</span>
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Package className="h-4 w-4" />
            Order Items
          </h4>
          <div className="space-y-2">
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between text-sm border-b pb-2 last:border-b-0">
                <div className="flex-1">
                  <div className="font-medium">{item.itemName}</div>
                  {item.itemDescription && (
                    <div className="text-xs text-muted-foreground">{item.itemDescription}</div>
                  )}
                  {item.specialInstructions && (
                    <div className="text-xs text-blue-600 mt-1">Note: {item.specialInstructions}</div>
                  )}
                  <div className="text-xs text-muted-foreground mt-1">
                    ${item.itemPrice.toFixed(2)} × {item.quantity}
                  </div>
                </div>
                <div className="font-semibold">${item.subtotal.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        {order.notes && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Additional Notes</h4>
            <p className="text-sm text-muted-foreground">{order.notes}</p>
          </div>
        )}

        {/* Total */}
        <div className="flex justify-between items-center pt-4 border-t font-semibold">
          <span>Total</span>
          <span className="text-lg">${order.totalAmount.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
