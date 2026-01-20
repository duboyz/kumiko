'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Phone, Mail, Clock, Calendar, FileText, ChevronDown, ChevronUp } from 'lucide-react'
import {
  OrderDto,
  OrderStatus,
  ORDER_STATUS_COLORS,
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_COLORS,
  PAYMENT_STATUS_LABELS,
  PaymentStatus,
  useUpdateOrderStatus,
  Currency,
  formatPrice,
  useLocationSelection,
} from '@shared'
import { toast } from 'sonner'

interface OrdersListProps {
  orders: OrderDto[]
  isLoading?: boolean
}

export function OrdersList({ orders, isLoading }: OrdersListProps) {
  const { selectedLocation } = useLocationSelection()
  const currency = selectedLocation?.currency ?? Currency.USD
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set())
  const updateOrderStatus = useUpdateOrderStatus()

  const toggleOrderExpanded = (orderId: string) => {
    const newExpanded = new Set(expandedOrders)
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId)
    } else {
      newExpanded.add(orderId)
    }
    setExpandedOrders(newExpanded)
  }

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus.mutateAsync({ orderId, status: newStatus })
      toast.success('Order status updated successfully')
    } catch (error) {
      toast.error('Failed to update order status')
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading orders...</div>
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No orders yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map(order => (
        <Card key={order.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg font-medium">{order.customerName}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(order.pickupDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {order.pickupTime}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={ORDER_STATUS_COLORS[order.status]}>{ORDER_STATUS_LABELS[order.status]}</Badge>
                <Badge variant="outline" className={PAYMENT_STATUS_COLORS[order.paymentStatus]}>
                  {PAYMENT_STATUS_LABELS[order.paymentStatus]}
                </Badge>
                <span className="text-lg font-semibold">{formatPrice(order.totalAmount, currency)}</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0 space-y-3">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Phone className="h-3.5 w-3.5" />
                {order.customerPhone}
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Mail className="h-3.5 w-3.5" />
                {order.customerEmail}
              </div>
            </div>

            {order.additionalNote && (
              <div className="flex items-start gap-1.5 text-sm">
                <FileText className="h-3.5 w-3.5 mt-0.5 text-muted-foreground" />
                <p className="text-muted-foreground italic">{order.additionalNote}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t">
              <Button variant="ghost" size="sm" onClick={() => toggleOrderExpanded(order.id)} className="text-sm">
                {expandedOrders.has(order.id) ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    Hide Items
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Show {order.orderItems.length} Item{order.orderItems.length !== 1 ? 's' : ''}
                  </>
                )}
              </Button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Select value={order.status} onValueChange={(status) => handleStatusChange(order.id, status as OrderStatus)}>
                  <SelectTrigger className="w-[160px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={OrderStatus.Pending}>Pending</SelectItem>
                    <SelectItem value={OrderStatus.Confirmed}>Confirmed</SelectItem>
                    <SelectItem value={OrderStatus.Ready}>Ready for Pickup</SelectItem>
                    <SelectItem value={OrderStatus.Completed}>Completed</SelectItem>
                    <SelectItem value={OrderStatus.Cancelled}>Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {expandedOrders.has(order.id) && (
              <div className="pt-3 border-t space-y-2">
                <h4 className="font-medium text-sm">Order Items:</h4>
                {order.orderItems.map(item => (
                  <div key={item.id} className="flex items-start justify-between py-2 px-3 bg-muted/50 rounded-md">
                    <div className="space-y-1">
                      <div className="font-medium">{item.menuItemName}</div>
                      {item.menuItemOptionName && (
                        <div className="text-sm text-muted-foreground">Option: {item.menuItemOptionName}</div>
                      )}
                      {item.specialInstructions && (
                        <div className="text-sm text-muted-foreground italic">Note: {item.specialInstructions}</div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {item.quantity} × {formatPrice(item.priceAtOrder, currency)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatPrice(item.quantity * item.priceAtOrder, currency)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
