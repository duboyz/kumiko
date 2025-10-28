'use client'

import { useParams } from 'next/navigation'
import { useOrderById, ORDER_STATUS_COLORS, ORDER_STATUS_LABELS, formatPrice, Currency } from '@shared'
import { LoadingSpinner } from '@/components'
import { ErrorMessage } from '@/components'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Clock, MapPin, Mail, Phone, Calendar, FileText, Store } from 'lucide-react'

export default function OrderStatusPage() {
  const params = useParams()
  const orderId = params.id as string

  const { data: order, isLoading, error } = useOrderById(orderId)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <ErrorMessage message={error instanceof Error ? error.message : 'Order not found'} />
      </div>
    )
  }

  // Parse currency from string
  const currency = Currency[order.restaurant.currency as keyof typeof Currency] || Currency.USD
  const pickupDate = new Date(order.pickupDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Order Status</h1>
          <p className="text-gray-600">Order ID: {order.id}</p>
        </div>

        {/* Status Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Current Status</CardTitle>
              <Badge className={ORDER_STATUS_COLORS[order.status]}>
                {ORDER_STATUS_LABELS[order.status]}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Restaurant Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Restaurant Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="font-semibold text-lg">{order.restaurant.name}</p>
            </div>
            <div className="flex items-start gap-2 text-gray-600">
              <MapPin className="h-4 w-4 mt-1" />
              <div>
                <p>{order.restaurant.address}</p>
                <p>{order.restaurant.city}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pickup Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Pickup Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">Date:</span>
              <span>{pickupDate}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="h-4 w-4" />
              <span className="font-medium">Time:</span>
              <span>{order.pickupTime}</span>
            </div>
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-gray-700">
              <span className="font-medium">Name:</span>
              <span>{order.customerName}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Phone className="h-4 w-4" />
              <span className="font-medium">Phone:</span>
              <span>{order.customerPhone}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Mail className="h-4 w-4" />
              <span className="font-medium">Email:</span>
              <span>{order.customerEmail}</span>
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.orderItems.map((item, index) => (
                <div key={item.id}>
                  {index > 0 && <Separator className="my-4" />}
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium">{item.menuItemName}</p>
                      {item.menuItemOptionName && (
                        <p className="text-sm text-gray-600">{item.menuItemOptionName}</p>
                      )}
                      {item.specialInstructions && (
                        <div className="flex items-start gap-1 mt-1">
                          <FileText className="h-3 w-3 mt-1 text-gray-500" />
                          <p className="text-sm text-gray-500 italic">{item.specialInstructions}</p>
                        </div>
                      )}
                      <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(item.priceAtOrder * item.quantity, currency)}</p>
                      <p className="text-sm text-gray-600">
                        {formatPrice(item.priceAtOrder, currency)} each
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              <Separator className="my-4" />

              {/* Total */}
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span>{formatPrice(order.totalAmount, currency)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Notes */}
        {order.additionalNote && order.additionalNote.trim() !== '' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Additional Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{order.additionalNote}</p>
            </CardContent>
          </Card>
        )}

        {/* Order Metadata */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-500 space-y-1">
              <p>Order placed: {new Date(order.createdAt).toLocaleString()}</p>
              <p>Last updated: {new Date(order.updatedAt).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
