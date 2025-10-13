'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Phone, Clock, Calendar, Eye } from 'lucide-react'
import { OrderDto, ORDER_STATUS_LABELS, OrderStatus, useUpdateOrderStatus, Currency, formatPrice, useLocationSelection } from '@shared'
import { toast } from 'sonner'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

interface OrdersKanbanViewProps {
    orders: OrderDto[]
}

const STATUSES: OrderStatus[] = ['Pending', 'Confirmed', 'Ready']

export function OrdersKanbanView({ orders }: OrdersKanbanViewProps) {
    const { selectedLocation } = useLocationSelection()
    const currency = selectedLocation?.currency ?? Currency.USD
    const updateOrderStatus = useUpdateOrderStatus()
    const [selectedOrder, setSelectedOrder] = useState<OrderDto | null>(null)

    const getOrdersByStatus = (status: OrderStatus) => {
        return orders.filter(order => order.status === status)
    }

    const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
        try {
            await updateOrderStatus.mutateAsync({ orderId, status: newStatus })
            toast.success('Order moved successfully')
        } catch (error) {
            toast.error('Failed to update order status')
        }
    }

    const moveOrder = (order: OrderDto, direction: 'forward' | 'backward') => {
        const currentIndex = STATUSES.indexOf(order.status)
        if (direction === 'forward' && currentIndex < STATUSES.length - 1) {
            handleStatusChange(order.id, STATUSES[currentIndex + 1])
        } else if (direction === 'backward' && currentIndex > 0) {
            handleStatusChange(order.id, STATUSES[currentIndex - 1])
        }
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {STATUSES.map(status => {
                    const statusOrders = getOrdersByStatus(status)
                    const statusIndex = STATUSES.indexOf(status)

                    return (
                        <div key={status} className="flex flex-col">
                            <div className="bg-muted p-3 rounded-t-lg border-b-2 border-primary">
                                <h3 className="font-semibold flex items-center justify-between">
                                    <span>{ORDER_STATUS_LABELS[status]}</span>
                                    <Badge variant="secondary">{statusOrders.length}</Badge>
                                </h3>
                            </div>

                            <div className="bg-muted/30 p-2 rounded-b-lg min-h-[500px] space-y-2">
                                {statusOrders.length === 0 ? (
                                    <p className="text-center text-sm text-muted-foreground py-8">No orders</p>
                                ) : (
                                    statusOrders.map(order => (
                                        <Card key={order.id} className="hover:shadow-md transition-shadow">
                                            <CardHeader className="pb-3">
                                                <div className="flex items-start justify-between">
                                                    <div className="space-y-1 flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <CardTitle className="text-base font-medium">{order.customerName}</CardTitle>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => setSelectedOrder(order)}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <Calendar className="h-3 w-3" />
                                                            {new Date(order.pickupDate).toLocaleDateString()}
                                                            <Clock className="h-3 w-3" />
                                                            {order.pickupTime}
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="pt-0 space-y-3">
                                                {/* Contact */}
                                                <div className="text-xs space-y-1">
                                                    <div className="flex items-center gap-1 text-muted-foreground">
                                                        <Phone className="h-3 w-3" />
                                                        {order.customerPhone}
                                                    </div>
                                                </div>

                                                {/* Order Items Summary */}
                                                <div className="space-y-1">
                                                    {order.orderItems.slice(0, 2).map(item => (
                                                        <p key={item.id} className="text-xs text-muted-foreground">
                                                            {item.quantity}x {item.menuItemName}
                                                            {item.menuItemOptionName && ` (${item.menuItemOptionName})`}
                                                        </p>
                                                    ))}
                                                    {order.orderItems.length > 2 && (
                                                        <p className="text-xs text-muted-foreground">
                                                            +{order.orderItems.length - 2} more items
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Total */}
                                                <div className="flex justify-between items-center pt-2 border-t">
                                                    <span className="text-sm font-semibold">Total</span>
                                                    <span className="font-bold">{formatPrice(order.totalAmount, currency)}</span>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex gap-2 pt-2">
                                                    {statusIndex > 0 && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="flex-1"
                                                            onClick={() => moveOrder(order, 'backward')}
                                                            disabled={updateOrderStatus.isPending}
                                                        >
                                                            ← Back
                                                        </Button>
                                                    )}
                                                    {order.status === 'Ready' ? (
                                                        <Button
                                                            variant="default"
                                                            size="sm"
                                                            className="flex-1"
                                                            onClick={() => handleStatusChange(order.id, 'Completed')}
                                                            disabled={updateOrderStatus.isPending}
                                                        >
                                                            Done
                                                        </Button>
                                                    ) : statusIndex < STATUSES.length - 1 && (
                                                        <Button
                                                            variant="default"
                                                            size="sm"
                                                            className="flex-1"
                                                            onClick={() => moveOrder(order, 'forward')}
                                                            disabled={updateOrderStatus.isPending}
                                                        >
                                                            Next →
                                                        </Button>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Order Details Dialog */}
            <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
                <DialogContent className="max-w-2xl">
                    {selectedOrder && (
                        <>
                            <DialogHeader>
                                <DialogTitle>Order Details - {selectedOrder.customerName}</DialogTitle>
                                <DialogDescription>
                                    Order ID: {selectedOrder.id}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                {/* Customer Info */}
                                <div>
                                    <h4 className="font-semibold mb-2">Customer Information</h4>
                                    <dl className="grid grid-cols-2 gap-2 text-sm">
                                        <dt className="text-muted-foreground">Name:</dt>
                                        <dd>{selectedOrder.customerName}</dd>
                                        <dt className="text-muted-foreground">Phone:</dt>
                                        <dd>{selectedOrder.customerPhone}</dd>
                                        {selectedOrder.customerEmail && (
                                            <>
                                                <dt className="text-muted-foreground">Email:</dt>
                                                <dd>{selectedOrder.customerEmail}</dd>
                                            </>
                                        )}
                                    </dl>
                                </div>

                                {/* Pickup Info */}
                                <div>
                                    <h4 className="font-semibold mb-2">Pickup Information</h4>
                                    <dl className="grid grid-cols-2 gap-2 text-sm">
                                        <dt className="text-muted-foreground">Date:</dt>
                                        <dd>{new Date(selectedOrder.pickupDate).toLocaleDateString()}</dd>
                                        <dt className="text-muted-foreground">Time:</dt>
                                        <dd>{selectedOrder.pickupTime}</dd>
                                    </dl>
                                </div>

                                {/* Order Items */}
                                <div>
                                    <h4 className="font-semibold mb-2">Order Items</h4>
                                    <div className="space-y-2">
                                        {selectedOrder.orderItems.map(item => (
                                            <div key={item.id} className="flex justify-between items-start p-3 bg-muted rounded-lg">
                                                <div>
                                                    <p className="font-medium">{item.menuItemName}</p>
                                                    {item.menuItemOptionName && (
                                                        <p className="text-sm text-muted-foreground">{item.menuItemOptionName}</p>
                                                    )}
                                                    {item.specialInstructions && (
                                                        <p className="text-xs text-muted-foreground mt-1">Note: {item.specialInstructions}</p>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm">x{item.quantity}</p>
                                                    <p className="font-medium">{formatPrice(item.priceAtOrder * item.quantity, currency)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Additional Notes */}
                                {selectedOrder.additionalNote && (
                                    <div>
                                        <h4 className="font-semibold mb-2">Additional Notes</h4>
                                        <p className="text-sm text-muted-foreground">{selectedOrder.additionalNote}</p>
                                    </div>
                                )}

                                {/* Total */}
                                <div className="flex justify-between items-center pt-4 border-t">
                                    <span className="font-semibold">Total:</span>
                                    <span className="text-2xl font-bold">{formatPrice(selectedOrder.totalAmount, currency)}</span>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}
