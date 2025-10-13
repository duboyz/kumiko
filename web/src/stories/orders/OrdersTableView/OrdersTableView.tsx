'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Eye, Phone, Mail } from 'lucide-react'
import { OrderDto, ORDER_STATUS_COLORS, ORDER_STATUS_LABELS, OrderStatus, useUpdateOrderStatus, Currency, formatPrice, useLocationSelection } from '@shared'
import { toast } from 'sonner'
import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

interface OrdersTableViewProps {
    orders: OrderDto[]
}

export function OrdersTableView({ orders }: OrdersTableViewProps) {
    const { selectedLocation } = useLocationSelection()
    const currency = selectedLocation?.currency ?? Currency.USD
    const updateOrderStatus = useUpdateOrderStatus()
    const [selectedOrder, setSelectedOrder] = useState<OrderDto | null>(null)

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            await updateOrderStatus.mutateAsync({ orderId, status: newStatus })
            toast.success('Order status updated successfully')
        } catch (error) {
            toast.error('Failed to update order status')
        }
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-12 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">No orders to display</p>
            </div>
        )
    }

    return (
        <>
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead>Order #</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Pickup</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map(order => (
                            <TableRow key={order.id} className="hover:bg-muted/30">
                                <TableCell className="font-mono text-xs">
                                    {order.id.slice(0, 8)}
                                </TableCell>
                                <TableCell>
                                    <div>
                                        <p className="font-medium">{order.customerName}</p>
                                        {order.additionalNote && (
                                            <p className="text-xs text-muted-foreground line-clamp-1">{order.additionalNote}</p>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="space-y-1 text-xs">
                                        <div className="flex items-center gap-1">
                                            <Phone className="h-3 w-3" />
                                            {order.customerPhone}
                                        </div>
                                        {order.customerEmail && (
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <Mail className="h-3 w-3" />
                                                {order.customerEmail}
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm">
                                        <p>{new Date(order.pickupDate).toLocaleDateString()}</p>
                                        <p className="text-muted-foreground">{order.pickupTime}</p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm">{order.orderItems.length} items</span>
                                </TableCell>
                                <TableCell>
                                    <span className="font-semibold">{formatPrice(order.totalAmount, currency)}</span>
                                </TableCell>
                                <TableCell>
                                    <Select
                                        value={order.status}
                                        onValueChange={(value) => handleStatusChange(order.id, value)}
                                        disabled={updateOrderStatus.isPending}
                                    >
                                        <SelectTrigger className="w-[140px]">
                                            <Badge className={ORDER_STATUS_COLORS[order.status]}>
                                                {ORDER_STATUS_LABELS[order.status]}
                                            </Badge>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                            <SelectItem value="Confirmed">Confirmed</SelectItem>
                                            <SelectItem value="Ready">Ready</SelectItem>
                                            <SelectItem value="Completed">Completed</SelectItem>
                                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSelectedOrder(order)}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
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

